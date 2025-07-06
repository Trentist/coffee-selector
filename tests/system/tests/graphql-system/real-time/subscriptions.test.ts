/**
 * Real-time Subscriptions Tests - Coffee Selection GraphQL System
 * اختبارات الاشتراكات المباشرة - نظام GraphQL لموقع Coffee Selection
 */

import { createClient } from 'graphql-ws';
import { apolloClient } from '../../../src/graphql-system';
import { gql } from '@apollo/client';

// Mock WebSocket for testing
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;
  protocol: string;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string, protocol?: string) {
    this.url = url;
    this.protocol = protocol || '';
    
    // Simulate connection opening
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    // Simulate message handling
  }

  close(code?: number, reason?: string) {
    this.readyState = MockWebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      if (this.onclose) {
        this.onclose(new CloseEvent('close', { code, reason }));
      }
    }, 100);
  }

  // Mock methods for testing
  simulateMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  simulateError() {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }
}

// Mock global WebSocket
(global as any).WebSocket = MockWebSocket;

// GraphQL Subscriptions
const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription OrderStatusChanged($orderId: ID!) {
    orderStatusChanged(orderId: $orderId) {
      id
      status
      paymentStatus
      shippingStatus
      trackingNumber
      updatedAt
      items {
        id
        product {
          id
          name
        }
        quantity
        unitPrice
        totalPrice
      }
      customer {
        id
        name
        email
      }
      shippingAddress {
        street
        city
        country
        zipCode
      }
    }
  }
`;

const CART_UPDATED_SUBSCRIPTION = gql`
  subscription CartUpdated {
    cartUpdated {
      id
      items {
        id
        product {
          id
          name
          price
          image
        }
        quantity
        unitPrice
        totalPrice
      }
      totalItems
      subtotal
      tax
      shipping
      discount
      total
      currency
      updatedAt
    }
  }
`;

const STOCK_UPDATED_SUBSCRIPTION = gql`
  subscription StockUpdated($productId: ID!) {
    stockUpdated(productId: $productId) {
      quantity
      isInStock
      stockStatus
      manageStock
      lowStockThreshold
    }
  }
`;

const ARAMEX_TRACKING_SUBSCRIPTION = gql`
  subscription AramexTrackingUpdated($awbNumber: String!) {
    aramexTrackingUpdated(awbNumber: $awbNumber) {
      waybillNumber
      updateCode
      updateDescription
      updateDateTime
      updateLocation
      comments
      status
      estimatedDelivery
      actualDelivery
    }
  }
`;

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription NotificationReceived($userId: ID!) {
    notificationReceived(userId: $userId) {
      id
      type
      title
      message
      data
      isRead
      createdAt
      expiresAt
    }
  }
`;

describe('Real-time Subscriptions Tests', () => {

  let mockWebSocket: MockWebSocket;

  beforeEach(() => {
    // Reset WebSocket mock
    mockWebSocket = new MockWebSocket('ws://localhost:4000/graphql');
  });

  afterEach(() => {
    if (mockWebSocket) {
      mockWebSocket.close();
    }
  });

  describe('Order Status Subscription', () => {
    it('should subscribe to order status changes', (done) => {
      const orderId = 'ORDER-001';
      
      const subscription = apolloClient.subscribe({
        query: ORDER_STATUS_SUBSCRIPTION,
        variables: { orderId }
      }).subscribe({
        next: (result) => {
          expect(result.data).toBeDefined();
          expect(result.data.orderStatusChanged).toBeDefined();
          expect(result.data.orderStatusChanged.id).toBe(orderId);
          done();
        },
        error: (error) => {
          console.error('Subscription error:', error);
          done(error);
        }
      });

      // Simulate order status update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              orderStatusChanged: {
                id: orderId,
                status: 'CONFIRMED',
                paymentStatus: 'COMPLETED',
                shippingStatus: 'PROCESSING',
                trackingNumber: '1234567890',
                updatedAt: new Date().toISOString(),
                items: [
                  {
                    id: '1',
                    product: {
                      id: '1',
                      name: 'قهوة عربية مختصة'
                    },
                    quantity: 2,
                    unitPrice: 45.99,
                    totalPrice: 91.98
                  }
                ],
                customer: {
                  id: '1',
                  name: 'أحمد محمد',
                  email: 'ahmed@example.com'
                },
                shippingAddress: {
                  street: 'شارع الملك فهد',
                  city: 'الرياض',
                  country: 'السعودية',
                  zipCode: '12345'
                }
              }
            }
          }
        });
      }, 200);

      // Cleanup
      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    it('should handle order status subscription errors', (done) => {
      const subscription = apolloClient.subscribe({
        query: ORDER_STATUS_SUBSCRIPTION,
        variables: { orderId: 'INVALID-ORDER' }
      }).subscribe({
        next: (result) => {
          // Should not reach here
          done(new Error('Should have failed'));
        },
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      // Simulate error
      setTimeout(() => {
        mockWebSocket.simulateError();
      }, 200);
    });

    it('should unsubscribe from order status changes', (done) => {
      const subscription = apolloClient.subscribe({
        query: ORDER_STATUS_SUBSCRIPTION,
        variables: { orderId: 'ORDER-001' }
      }).subscribe({
        next: (result) => {
          // Should receive first update
          expect(result.data.orderStatusChanged).toBeDefined();
          
          // Unsubscribe immediately
          subscription.unsubscribe();
          
          // Wait and verify no more updates
          setTimeout(() => {
            done();
          }, 500);
        },
        error: done
      });

      // Send first update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              orderStatusChanged: {
                id: 'ORDER-001',
                status: 'CONFIRMED',
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
      }, 100);

      // Send second update (should not be received)
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '2',
          type: 'data',
          payload: {
            data: {
              orderStatusChanged: {
                id: 'ORDER-001',
                status: 'SHIPPED',
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
      }, 300);
    });
  });

  describe('Cart Updates Subscription', () => {
    it('should subscribe to cart updates', (done) => {
      const subscription = apolloClient.subscribe({
        query: CART_UPDATED_SUBSCRIPTION
      }).subscribe({
        next: (result) => {
          expect(result.data).toBeDefined();
          expect(result.data.cartUpdated).toBeDefined();
          expect(result.data.cartUpdated.items).toBeInstanceOf(Array);
          expect(result.data.cartUpdated.total).toBeGreaterThan(0);
          done();
        },
        error: done
      });

      // Simulate cart update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              cartUpdated: {
                id: 'CART-001',
                items: [
                  {
                    id: '1',
                    product: {
                      id: '1',
                      name: 'قهوة عربية مختصة',
                      price: 45.99,
                      image: '/images/coffee-1.jpg'
                    },
                    quantity: 2,
                    unitPrice: 45.99,
                    totalPrice: 91.98
                  }
                ],
                totalItems: 2,
                subtotal: 91.98,
                tax: 13.80,
                shipping: 25.00,
                discount: 0,
                total: 130.78,
                currency: 'SAR',
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    it('should handle multiple cart updates', (done) => {
      let updateCount = 0;
      const expectedUpdates = 3;

      const subscription = apolloClient.subscribe({
        query: CART_UPDATED_SUBSCRIPTION
      }).subscribe({
        next: (result) => {
          updateCount++;
          expect(result.data.cartUpdated).toBeDefined();
          
          if (updateCount === expectedUpdates) {
            subscription.unsubscribe();
            done();
          }
        },
        error: done
      });

      // Send multiple updates
      for (let i = 1; i <= expectedUpdates; i++) {
        setTimeout(() => {
          mockWebSocket.simulateMessage({
            id: i.toString(),
            type: 'data',
            payload: {
              data: {
                cartUpdated: {
                  id: 'CART-001',
                  items: [],
                  totalItems: i,
                  total: i * 45.99,
                  updatedAt: new Date().toISOString()
                }
              }
            }
          });
        }, i * 100);
      }
    });
  });

  describe('Stock Updates Subscription', () => {
    it('should subscribe to product stock updates', (done) => {
      const productId = 'PRODUCT-001';

      const subscription = apolloClient.subscribe({
        query: STOCK_UPDATED_SUBSCRIPTION,
        variables: { productId }
      }).subscribe({
        next: (result) => {
          expect(result.data).toBeDefined();
          expect(result.data.stockUpdated).toBeDefined();
          expect(result.data.stockUpdated.quantity).toBeDefined();
          expect(result.data.stockUpdated.isInStock).toBeDefined();
          done();
        },
        error: done
      });

      // Simulate stock update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              stockUpdated: {
                quantity: 50,
                isInStock: true,
                stockStatus: 'IN_STOCK',
                manageStock: true,
                lowStockThreshold: 10
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    it('should handle low stock alerts', (done) => {
      const productId = 'PRODUCT-001';

      const subscription = apolloClient.subscribe({
        query: STOCK_UPDATED_SUBSCRIPTION,
        variables: { productId }
      }).subscribe({
        next: (result) => {
          const stock = result.data.stockUpdated;
          
          if (stock.quantity <= stock.lowStockThreshold) {
            expect(stock.quantity).toBeLessThanOrEqual(stock.lowStockThreshold);
            expect(stock.stockStatus).toBe('LOW_STOCK');
            done();
          }
        },
        error: done
      });

      // Simulate low stock update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              stockUpdated: {
                quantity: 5,
                isInStock: true,
                stockStatus: 'LOW_STOCK',
                manageStock: true,
                lowStockThreshold: 10
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    it('should handle out of stock updates', (done) => {
      const productId = 'PRODUCT-001';

      const subscription = apolloClient.subscribe({
        query: STOCK_UPDATED_SUBSCRIPTION,
        variables: { productId }
      }).subscribe({
        next: (result) => {
          const stock = result.data.stockUpdated;
          
          if (!stock.isInStock) {
            expect(stock.quantity).toBe(0);
            expect(stock.isInStock).toBe(false);
            expect(stock.stockStatus).toBe('OUT_OF_STOCK');
            done();
          }
        },
        error: done
      });

      // Simulate out of stock update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              stockUpdated: {
                quantity: 0,
                isInStock: false,
                stockStatus: 'OUT_OF_STOCK',
                manageStock: true,
                lowStockThreshold: 10
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });
  });

  describe('Aramex Tracking Subscription', () => {
    it('should subscribe to Aramex tracking updates', (done) => {
      const awbNumber = '1234567890';

      const subscription = apolloClient.subscribe({
        query: ARAMEX_TRACKING_SUBSCRIPTION,
        variables: { awbNumber }
      }).subscribe({
        next: (result) => {
          expect(result.data).toBeDefined();
          expect(result.data.aramexTrackingUpdated).toBeDefined();
          expect(result.data.aramexTrackingUpdated.waybillNumber).toBe(awbNumber);
          done();
        },
        error: done
      });

      // Simulate tracking update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              aramexTrackingUpdated: {
                waybillNumber: awbNumber,
                updateCode: 'SH014',
                updateDescription: 'Shipment out for delivery',
                updateDateTime: new Date().toISOString(),
                updateLocation: 'الرياض - مركز التوزيع',
                comments: 'الشحنة في طريقها للتسليم',
                status: 'OUT_FOR_DELIVERY',
                estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                actualDelivery: null
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    it('should handle delivery confirmation', (done) => {
      const awbNumber = '1234567890';

      const subscription = apolloClient.subscribe({
        query: ARAMEX_TRACKING_SUBSCRIPTION,
        variables: { awbNumber }
      }).subscribe({
        next: (result) => {
          const tracking = result.data.aramexTrackingUpdated;
          
          if (tracking.status === 'DELIVERED') {
            expect(tracking.actualDelivery).toBeDefined();
            expect(tracking.updateDescription).toContain('delivered');
            done();
          }
        },
        error: done
      });

      // Simulate delivery update
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              aramexTrackingUpdated: {
                waybillNumber: awbNumber,
                updateCode: 'SH023',
                updateDescription: 'Shipment delivered successfully',
                updateDateTime: new Date().toISOString(),
                updateLocation: 'الرياض - العنوان النهائي',
                comments: 'تم التسليم بنجاح للمستلم',
                status: 'DELIVERED',
                estimatedDelivery: new Date().toISOString(),
                actualDelivery: new Date().toISOString()
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });
  });

  describe('Notification Subscription', () => {
    it('should subscribe to user notifications', (done) => {
      const userId = 'USER-001';

      const subscription = apolloClient.subscribe({
        query: NOTIFICATION_SUBSCRIPTION,
        variables: { userId }
      }).subscribe({
        next: (result) => {
          expect(result.data).toBeDefined();
          expect(result.data.notificationReceived).toBeDefined();
          expect(result.data.notificationReceived.title).toBeDefined();
          expect(result.data.notificationReceived.message).toBeDefined();
          done();
        },
        error: done
      });

      // Simulate notification
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              notificationReceived: {
                id: 'NOTIF-001',
                type: 'ORDER_UPDATE',
                title: 'تحديث الطلب',
                message: 'تم شحن طلبك رقم ORDER-001',
                data: {
                  orderId: 'ORDER-001',
                  trackingNumber: '1234567890'
                },
                isRead: false,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              }
            }
          }
        });
      }, 200);

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    it('should handle different notification types', (done) => {
      const userId = 'USER-001';
      const notificationTypes = ['ORDER_UPDATE', 'STOCK_ALERT', 'PROMOTION', 'SYSTEM'];
      let receivedTypes: string[] = [];

      const subscription = apolloClient.subscribe({
        query: NOTIFICATION_SUBSCRIPTION,
        variables: { userId }
      }).subscribe({
        next: (result) => {
          const notification = result.data.notificationReceived;
          receivedTypes.push(notification.type);
          
          if (receivedTypes.length === notificationTypes.length) {
            expect(receivedTypes).toEqual(expect.arrayContaining(notificationTypes));
            subscription.unsubscribe();
            done();
          }
        },
        error: done
      });

      // Send different notification types
      notificationTypes.forEach((type, index) => {
        setTimeout(() => {
          mockWebSocket.simulateMessage({
            id: (index + 1).toString(),
            type: 'data',
            payload: {
              data: {
                notificationReceived: {
                  id: `NOTIF-${index + 1}`,
                  type,
                  title: `إشعار ${type}`,
                  message: `رسالة إشعار من نوع ${type}`,
                  data: {},
                  isRead: false,
                  createdAt: new Date().toISOString()
                }
              }
            }
          });
        }, (index + 1) * 100);
      });
    });
  });

  describe('Connection Management', () => {
    it('should handle WebSocket connection establishment', (done) => {
      const ws = new MockWebSocket('ws://localhost:4000/graphql');
      
      ws.onopen = (event) => {
        expect(ws.readyState).toBe(MockWebSocket.OPEN);
        done();
      };
    });

    it('should handle WebSocket connection errors', (done) => {
      const ws = new MockWebSocket('ws://localhost:4000/graphql');
      
      ws.onerror = (event) => {
        expect(event).toBeDefined();
        done();
      };

      setTimeout(() => {
        ws.simulateError();
      }, 100);
    });

    it('should handle WebSocket connection closure', (done) => {
      const ws = new MockWebSocket('ws://localhost:4000/graphql');
      
      ws.onclose = (event) => {
        expect(ws.readyState).toBe(MockWebSocket.CLOSED);
        expect(event.code).toBeDefined();
        done();
      };

      setTimeout(() => {
        ws.close(1000, 'Normal closure');
      }, 100);
    });

    it('should reconnect on connection loss', (done) => {
      let connectionCount = 0;
      
      const createConnection = () => {
        connectionCount++;
        const ws = new MockWebSocket('ws://localhost:4000/graphql');
        
        ws.onopen = () => {
          if (connectionCount === 1) {
            // Simulate connection loss
            setTimeout(() => {
              ws.close(1006, 'Connection lost');
            }, 100);
          } else if (connectionCount === 2) {
            // Reconnection successful
            expect(connectionCount).toBe(2);
            done();
          }
        };

        ws.onclose = (event) => {
          if (event.code === 1006 && connectionCount === 1) {
            // Reconnect after connection loss
            setTimeout(createConnection, 100);
          }
        };
      };

      createConnection();
    });
  });

  describe('Subscription Performance', () => {
    it('should handle high-frequency updates', (done) => {
      const updateCount = 100;
      let receivedCount = 0;

      const subscription = apolloClient.subscribe({
        query: STOCK_UPDATED_SUBSCRIPTION,
        variables: { productId: 'PRODUCT-001' }
      }).subscribe({
        next: (result) => {
          receivedCount++;
          
          if (receivedCount === updateCount) {
            expect(receivedCount).toBe(updateCount);
            subscription.unsubscribe();
            done();
          }
        },
        error: done
      });

      // Send high-frequency updates
      for (let i = 1; i <= updateCount; i++) {
        setTimeout(() => {
          mockWebSocket.simulateMessage({
            id: i.toString(),
            type: 'data',
            payload: {
              data: {
                stockUpdated: {
                  quantity: 100 - i,
                  isInStock: (100 - i) > 0,
                  stockStatus: (100 - i) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
                  manageStock: true,
                  lowStockThreshold: 10
                }
              }
            }
          });
        }, i * 10); // 10ms intervals
      }
    });

    it('should handle multiple concurrent subscriptions', (done) => {
      const subscriptions = [];
      const completedSubscriptions = new Set();
      const totalSubscriptions = 5;

      for (let i = 1; i <= totalSubscriptions; i++) {
        const subscription = apolloClient.subscribe({
          query: ORDER_STATUS_SUBSCRIPTION,
          variables: { orderId: `ORDER-${i.toString().padStart(3, '0')}` }
        }).subscribe({
          next: (result) => {
            completedSubscriptions.add(i);
            
            if (completedSubscriptions.size === totalSubscriptions) {
              // Cleanup all subscriptions
              subscriptions.forEach(sub => sub.unsubscribe());
              done();
            }
          },
          error: done
        });

        subscriptions.push(subscription);
      }

      // Send updates for all subscriptions
      for (let i = 1; i <= totalSubscriptions; i++) {
        setTimeout(() => {
          mockWebSocket.simulateMessage({
            id: i.toString(),
            type: 'data',
            payload: {
              data: {
                orderStatusChanged: {
                  id: `ORDER-${i.toString().padStart(3, '0')}`,
                  status: 'CONFIRMED',
                  updatedAt: new Date().toISOString()
                }
              }
            }
          });
        }, i * 50);
      }
    });
  });

  describe('Error Recovery', () => {
    it('should recover from temporary connection issues', (done) => {
      let messageCount = 0;

      const subscription = apolloClient.subscribe({
        query: CART_UPDATED_SUBSCRIPTION
      }).subscribe({
        next: (result) => {
          messageCount++;
          
          if (messageCount === 2) {
            // Received message after recovery
            subscription.unsubscribe();
            done();
          }
        },
        error: (error) => {
          // Should not reach here in this test
          done(error);
        }
      });

      // Send first message
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              cartUpdated: {
                id: 'CART-001',
                items: [],
                total: 0,
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
      }, 100);

      // Simulate temporary error
      setTimeout(() => {
        mockWebSocket.simulateError();
      }, 200);

      // Send second message after recovery
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '2',
          type: 'data',
          payload: {
            data: {
              cartUpdated: {
                id: 'CART-001',
                items: [],
                total: 100,
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
      }, 400);
    });
  });

  describe('Authentication and Authorization', () => {
    it('should handle authenticated subscriptions', (done) => {
      // Mock authentication token
      const authToken = 'mock-auth-token';
      
      const subscription = apolloClient.subscribe({
        query: NOTIFICATION_SUBSCRIPTION,
        variables: { userId: 'USER-001' },
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      }).subscribe({
        next: (result) => {
          expect(result.data.notificationReceived).toBeDefined();
          subscription.unsubscribe();
          done();
        },
        error: done
      });

      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'data',
          payload: {
            data: {
              notificationReceived: {
                id: 'NOTIF-001',
                type: 'ORDER_UPDATE',
                title: 'تحديث الطلب',
                message: 'تم تحديث طلبك',
                data: {},
                isRead: false,
                createdAt: new Date().toISOString()
              }
            }
          }
        });
      }, 200);
    });

    it('should handle unauthorized subscription attempts', (done) => {
      const subscription = apolloClient.subscribe({
        query: NOTIFICATION_SUBSCRIPTION,
        variables: { userId: 'UNAUTHORIZED-USER' }
      }).subscribe({
        next: (result) => {
          // Should not reach here
          done(new Error('Should have been unauthorized'));
        },
        error: (error) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('Unauthorized');
          done();
        }
      });

      // Simulate unauthorized error
      setTimeout(() => {
        mockWebSocket.simulateMessage({
          id: '1',
          type: 'error',
          payload: {
            message: 'Unauthorized access to subscription'
          }
        });
      }, 200);
    });
  });
});

// Test utilities for subscriptions
export const createMockSubscription = (query: any, variables: any = {}) => {
  return apolloClient.subscribe({
    query,
    variables
  });
};

export const simulateSubscriptionUpdate = (mockWs: MockWebSocket, data: any) => {
  mockWs.simulateMessage({
    id: Math.random().toString(),
    type: 'data',
    payload: { data }
  });
};

export const waitForSubscriptionUpdate = (subscription: any, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Subscription timeout'));
    }, timeout);

    subscription.subscribe({
      next: (result: any) => {
        clearTimeout(timer);
        resolve(result);
      },
      error: (error: any) => {
        clearTimeout(timer);
        reject(error);
      }
    });
  });
};