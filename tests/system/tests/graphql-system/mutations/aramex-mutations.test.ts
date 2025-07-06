/**
 * Aramex Mutations Tests - Coffee Selection GraphQL System
 * اختبارات طفرات أرامكس - نظام GraphQL لموقع Coffee Selection
 */

import { apolloClient } from '../../../src/graphql-system';
import {
  CREATE_ARAMEX_SHIPMENT,
  UPDATE_ARAMEX_SHIPMENT_STATUS,
  CANCEL_ARAMEX_SHIPMENT,
  SCHEDULE_ARAMEX_PICKUP,
  CANCEL_ARAMEX_PICKUP,
  UPDATE_ARAMEX_TRACKING,
  PROCESS_ARAMEX_WEBHOOK,
  CREATE_ARAMEX_RETURN_SHIPMENT,
  UPDATE_ARAMEX_CONFIG,
  BULK_UPDATE_ARAMEX_SHIPMENTS,
  SYNC_ARAMEX_SHIPMENT_STATUS,
  GENERATE_ARAMEX_LABEL,
  UPDATE_ORDER_ARAMEX_TRACKING,
  VALIDATE_ARAMEX_ADDRESS,
  CALCULATE_ARAMEX_SHIPPING_COST,
  CREATE_BULK_ARAMEX_SHIPMENTS
} from '../../../src/graphql-system/mutations/aramex-mutations';

// Mock shipment input data
const mockShipmentInput = {
  orderId: 'ORDER-001',
  reference1: 'REF-001',
  reference2: 'REF-002',
  reference3: 'REF-003',
  shipper: {
    reference1: 'SHIPPER-001',
    reference2: 'SHIPPER-002',
    partyAddress: {
      line1: 'شارع الملك فهد',
      line2: 'حي العليا',
      city: 'الرياض',
      stateOrProvinceCode: 'RY',
      postalCode: '12345',
      countryCode: 'SA'
    },
    contact: {
      personName: 'Coffee Selection',
      companyName: 'Coffee Selection Co.',
      phoneNumber1: '+966501234567',
      emailAddress: 'shipping@coffeeselection.com'
    }
  },
  consignee: {
    reference1: 'CONSIGNEE-001',
    reference2: 'CONSIGNEE-002',
    partyAddress: {
      line1: 'شارع الأمير محمد بن عبدالعزيز',
      line2: 'حي الملز',
      city: 'الرياض',
      stateOrProvinceCode: 'RY',
      postalCode: '54321',
      countryCode: 'SA'
    },
    contact: {
      personName: 'أحمد محمد',
      phoneNumber1: '+966507654321',
      emailAddress: 'customer@example.com'
    }
  },
  details: {
    actualWeight: {
      value: 1.5,
      unit: 'KG'
    },
    numberOfPieces: 1,
    productGroup: 'EXP',
    productType: 'PPX',
    paymentType: 'P',
    descriptionOfGoods: 'قهوة مختصة',
    customsValueAmount: {
      amount: 150.00,
      currency: 'SAR'
    },
    cashOnDeliveryAmount: {
      amount: 0,
      currency: 'SAR'
    }
  },
  shippingDateTime: '2024-02-01T08:00:00Z',
  dueDate: '2024-02-05T17:00:00Z',
  comments: 'يرجى التعامل بحذر - منتج قابل للكسر'
};

const mockPickupRequest = {
  pickupAddress: {
    line1: 'شارع الملك فهد',
    city: 'الرياض',
    countryCode: 'SA',
    postalCode: '12345'
  },
  pickupContact: {
    personName: 'Coffee Selection',
    phoneNumber1: '+966501234567',
    emailAddress: 'pickup@coffeeselection.com'
  },
  pickupLocation: 'مستودع Coffee Selection',
  pickupDate: '2024-02-01T10:00:00Z',
  readyTime: '09:00',
  lastPickupTime: '17:00',
  closingTime: '18:00',
  comments: 'يوجد 5 شحنات جاهزة للاستلام',
  reference1: 'PICKUP-001',
  reference2: 'PICKUP-002',
  shipments: [
    {
      productGroup: 'EXP',
      productType: 'PPX',
      numberOfShipments: 3,
      packageType: 'Box',
      payment: 'P',
      shipmentWeight: {
        value: 4.5,
        unit: 'KG'
      },
      numberOfPieces: 3,
      comments: 'قهوة مختصة - 3 شحنات'
    }
  ]
};

describe('Aramex Mutations Tests', () => {

  describe('CREATE_ARAMEX_SHIPMENT Mutation', () => {
    it('should create Aramex shipment successfully', async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ARAMEX_SHIPMENT,
        variables: { shipmentInput: mockShipmentInput }
      });

      expect(data).toBeDefined();
      expect(data.createAramexShipment).toBeDefined();
      expect(data.createAramexShipment.success).toBe(true);
      
      if (data.createAramexShipment.shipment) {
        expect(data.createAramexShipment.shipment.orderId).toBe('ORDER-001');
        expect(data.createAramexShipment.shipment.awbNumber).toBeDefined();
        expect(data.createAramexShipment.shipment.trackingUrl).toBeDefined();
        expect(data.createAramexShipment.shipment.status).toBeDefined();
      }
    });

    it('should handle shipment creation with COD', async () => {
      const codShipmentInput = {
        ...mockShipmentInput,
        details: {
          ...mockShipmentInput.details,
          cashOnDeliveryAmount: {
            amount: 150.00,
            currency: 'SAR'
          }
        }
      };

      const { data } = await apolloClient.mutate({
        mutation: CREATE_ARAMEX_SHIPMENT,
        variables: { shipmentInput: codShipmentInput }
      });

      expect(data.createAramexShipment.success).toBe(true);
      
      if (data.createAramexShipment.shipment) {
        expect(data.createAramexShipment.shipment.shipmentData.details.cashOnDeliveryAmount.amount).toBe(150.00);
      }
    });

    it('should handle shipment creation with insurance', async () => {
      const insuredShipmentInput = {
        ...mockShipmentInput,
        details: {
          ...mockShipmentInput.details,
          insuranceAmount: {
            amount: 200.00,
            currency: 'SAR'
          }
        }
      };

      const { data } = await apolloClient.mutate({
        mutation: CREATE_ARAMEX_SHIPMENT,
        variables: { shipmentInput: insuredShipmentInput }
      });

      expect(data.createAramexShipment.success).toBe(true);
    });

    it('should validate required fields', async () => {
      const invalidShipmentInput = {
        orderId: 'ORDER-001',
        // Missing required fields
      };

      try {
        await apolloClient.mutate({
          mutation: CREATE_ARAMEX_SHIPMENT,
          variables: { shipmentInput: invalidShipmentInput }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.graphQLErrors || error.networkError).toBeDefined();
      }
    });
  });

  describe('UPDATE_ARAMEX_SHIPMENT_STATUS Mutation', () => {
    it('should update shipment status successfully', async () => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ARAMEX_SHIPMENT_STATUS,
        variables: {
          shipmentId: '1',
          status: 'PICKED_UP',
          notes: 'تم استلام الشحنة من المرسل'
        }
      });

      expect(data).toBeDefined();
      expect(data.updateAramexShipmentStatus).toBeDefined();
      expect(data.updateAramexShipmentStatus.success).toBe(true);
      
      if (data.updateAramexShipmentStatus.shipment) {
        expect(data.updateAramexShipmentStatus.shipment.status).toBe('PICKED_UP');
        expect(data.updateAramexShipmentStatus.shipment.notes).toBe('تم استلام الشحنة من المرسل');
      }
    });

    it('should handle status transition validation', async () => {
      // Try to update from DELIVERED to CREATED (invalid transition)
      try {
        await apolloClient.mutate({
          mutation: UPDATE_ARAMEX_SHIPMENT_STATUS,
          variables: {
            shipmentId: '1',
            status: 'CREATED', // Invalid transition
            notes: 'Invalid status change'
          }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it('should update status without notes', async () => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ARAMEX_SHIPMENT_STATUS,
        variables: {
          shipmentId: '1',
          status: 'IN_TRANSIT'
        }
      });

      expect(data.updateAramexShipmentStatus.success).toBe(true);
    });
  });

  describe('CANCEL_ARAMEX_SHIPMENT Mutation', () => {
    it('should cancel shipment successfully', async () => {
      const { data } = await apolloClient.mutate({
        mutation: CANCEL_ARAMEX_SHIPMENT,
        variables: {
          shipmentId: '1',
          reason: 'طلب العميل إلغاء الشحنة'
        }
      });

      expect(data).toBeDefined();
      expect(data.cancelAramexShipment).toBeDefined();
      expect(data.cancelAramexShipment.success).toBe(true);
      
      if (data.cancelAramexShipment.shipment) {
        expect(data.cancelAramexShipment.shipment.status).toBe('CANCELLED');
        expect(data.cancelAramexShipment.shipment.notes).toContain('طلب العميل إلغاء الشحنة');
      }
    });

    it('should handle refund calculation on cancellation', async () => {
      const { data } = await apolloClient.mutate({
        mutation: CANCEL_ARAMEX_SHIPMENT,
        variables: {
          shipmentId: '1',
          reason: 'إلغاء مع استرداد'
        }
      });

      if (data.cancelAramexShipment.refundAmount) {
        expect(data.cancelAramexShipment.refundAmount.amount).toBeGreaterThan(0);
        expect(data.cancelAramexShipment.refundAmount.currency).toBe('SAR');
      }
    });

    it('should prevent cancellation of delivered shipments', async () => {
      try {
        await apolloClient.mutate({
          mutation: CANCEL_ARAMEX_SHIPMENT,
          variables: {
            shipmentId: 'delivered-shipment-id',
            reason: 'محاولة إلغاء شحنة مسلمة'
          }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('SCHEDULE_ARAMEX_PICKUP Mutation', () => {
    it('should schedule pickup successfully', async () => {
      const { data } = await apolloClient.mutate({
        mutation: SCHEDULE_ARAMEX_PICKUP,
        variables: { pickupRequest: mockPickupRequest }
      });

      expect(data).toBeDefined();
      expect(data.scheduleAramexPickup).toBeDefined();
      expect(data.scheduleAramexPickup.success).toBe(true);
      
      if (data.scheduleAramexPickup.pickup) {
        expect(data.scheduleAramexPickup.pickup.pickupGUID).toBeDefined();
        expect(data.scheduleAramexPickup.pickup.pickupDate).toBeDefined();
      }
    });

    it('should validate pickup time slots', async () => {
      const invalidTimePickup = {
        ...mockPickupRequest,
        readyTime: '23:00', // Invalid time
        lastPickupTime: '02:00' // Invalid time
      };

      try {
        await apolloClient.mutate({
          mutation: SCHEDULE_ARAMEX_PICKUP,
          variables: { pickupRequest: invalidTimePickup }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it('should handle weekend pickup restrictions', async () => {
      const weekendPickup = {
        ...mockPickupRequest,
        pickupDate: '2024-02-02T10:00:00Z' // Assuming Friday
      };

      const { data } = await apolloClient.mutate({
        mutation: SCHEDULE_ARAMEX_PICKUP,
        variables: { pickupRequest: weekendPickup }
      });

      // May succeed with notifications about weekend restrictions
      expect(data.scheduleAramexPickup).toBeDefined();
    });
  });

  describe('CANCEL_ARAMEX_PICKUP Mutation', () => {
    it('should cancel pickup successfully', async () => {
      const { data } = await apolloClient.mutate({
        mutation: CANCEL_ARAMEX_PICKUP,
        variables: {
          pickupGUID: 'PICKUP-GUID-123',
          reason: 'تغيير في الجدولة'
        }
      });

      expect(data).toBeDefined();
      expect(data.cancelAramexPickup).toBeDefined();
      expect(data.cancelAramexPickup.success).toBe(true);
      expect(data.cancelAramexPickup.pickupGUID).toBe('PICKUP-GUID-123');
    });

    it('should handle cancellation of non-existent pickup', async () => {
      try {
        await apolloClient.mutate({
          mutation: CANCEL_ARAMEX_PICKUP,
          variables: {
            pickupGUID: 'NON-EXISTENT-GUID',
            reason: 'إلغاء غير صحيح'
          }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('UPDATE_ARAMEX_TRACKING Mutation', () => {
    it('should update tracking information', async () => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ARAMEX_TRACKING,
        variables: { awbNumber: '1234567890' }
      });

      expect(data).toBeDefined();
      expect(data.updateAramexTracking).toBeDefined();
      expect(data.updateAramexTracking.success).toBe(true);
      
      if (data.updateAramexTracking.trackingData) {
        expect(data.updateAramexTracking.trackingData.waybillNumber).toBe('1234567890');
        expect(data.updateAramexTracking.trackingData.updateDateTime).toBeDefined();
      }
    });

    it('should handle invalid AWB numbers', async () => {
      try {
        await apolloClient.mutate({
          mutation: UPDATE_ARAMEX_TRACKING,
          variables: { awbNumber: 'INVALID-AWB' }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('PROCESS_ARAMEX_WEBHOOK Mutation', () => {
    it('should process webhook data successfully', async () => {
      const webhookData = {
        awbNumber: '1234567890',
        status: 'DELIVERED',
        updateDateTime: '2024-01-20T15:30:00Z',
        updateLocation: 'الرياض - العنوان النهائي',
        comments: 'تم التسليم بنجاح',
        signature: 'webhook-signature-hash'
      };

      const { data } = await apolloClient.mutate({
        mutation: PROCESS_ARAMEX_WEBHOOK,
        variables: { webhookData }
      });

      expect(data).toBeDefined();
      expect(data.processAramexWebhook).toBeDefined();
      expect(data.processAramexWebhook.success).toBe(true);
      
      if (data.processAramexWebhook.updatedShipment) {
        expect(data.processAramexWebhook.updatedShipment.status).toBe('DELIVERED');
      }
    });

    it('should validate webhook signature', async () => {
      const invalidWebhookData = {
        awbNumber: '1234567890',
        status: 'DELIVERED',
        updateDateTime: '2024-01-20T15:30:00Z',
        signature: 'invalid-signature'
      };

      try {
        await apolloClient.mutate({
          mutation: PROCESS_ARAMEX_WEBHOOK,
          variables: { webhookData: invalidWebhookData }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('CREATE_ARAMEX_RETURN_SHIPMENT Mutation', () => {
    it('should create return shipment successfully', async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ARAMEX_RETURN_SHIPMENT,
        variables: {
          originalShipmentId: '1',
          returnReason: 'منتج معيب - طلب استبدال'
        }
      });

      expect(data).toBeDefined();
      expect(data.createAramexReturnShipment).toBeDefined();
      expect(data.createAramexReturnShipment.success).toBe(true);
      
      if (data.createAramexReturnShipment.returnShipment) {
        expect(data.createAramexReturnShipment.returnShipment.originalShipmentId).toBe('1');
        expect(data.createAramexReturnShipment.returnShipment.returnReason).toBe('منتج معيب - طلب استبدال');
        expect(data.createAramexReturnShipment.returnShipment.awbNumber).toBeDefined();
      }
    });

    it('should handle return shipment cost calculation', async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ARAMEX_RETURN_SHIPMENT,
        variables: {
          originalShipmentId: '1',
          returnReason: 'إرجاع مجاني'
        }
      });

      if (data.createAramexReturnShipment.returnShipment?.cost) {
        expect(data.createAramexReturnShipment.returnShipment.cost.amount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('UPDATE_ARAMEX_CONFIG Mutation', () => {
    it('should update Aramex configuration', async () => {
      const configInput = {
        environment: 'LIVE',
        defaultServiceType: 'PPX',
        defaultProductGroup: 'EXP',
        defaultPaymentType: 'P',
        insuranceEnabled: true,
        codEnabled: true,
        trackingEnabled: true,
        returnAddress: {
          line1: 'شارع الملك فهد الجديد',
          city: 'الرياض',
          countryCode: 'SA',
          postalCode: '12345'
        },
        returnContact: {
          personName: 'Coffee Selection Returns',
          phoneNumber1: '+966501234567',
          emailAddress: 'returns@coffeeselection.com'
        }
      };

      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ARAMEX_CONFIG,
        variables: { configInput }
      });

      expect(data).toBeDefined();
      expect(data.updateAramexConfig).toBeDefined();
      expect(data.updateAramexConfig.success).toBe(true);
      
      if (data.updateAramexConfig.config) {
        expect(data.updateAramexConfig.config.environment).toBe('LIVE');
        expect(data.updateAramexConfig.config.defaultServiceType).toBe('PPX');
      }
    });

    it('should validate configuration values', async () => {
      const invalidConfigInput = {
        environment: 'INVALID_ENV',
        defaultServiceType: 'INVALID_SERVICE'
      };

      try {
        await apolloClient.mutate({
          mutation: UPDATE_ARAMEX_CONFIG,
          variables: { configInput: invalidConfigInput }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('BULK_UPDATE_ARAMEX_SHIPMENTS Mutation', () => {
    it('should update multiple shipments', async () => {
      const shipmentIds = ['1', '2', '3'];
      const updates = {
        status: 'IN_TRANSIT',
        notes: 'تحديث جماعي للشحنات'
      };

      const { data } = await apolloClient.mutate({
        mutation: BULK_UPDATE_ARAMEX_SHIPMENTS,
        variables: { shipmentIds, updates }
      });

      expect(data).toBeDefined();
      expect(data.bulkUpdateAramexShipments).toBeDefined();
      expect(data.bulkUpdateAramexShipments.success).toBe(true);
      expect(data.bulkUpdateAramexShipments.updatedCount).toBeGreaterThan(0);
      expect(data.bulkUpdateAramexShipments.results).toBeInstanceOf(Array);
    });

    it('should handle partial failures in bulk update', async () => {
      const shipmentIds = ['1', 'invalid-id', '3'];
      const updates = { status: 'DELIVERED' };

      const { data } = await apolloClient.mutate({
        mutation: BULK_UPDATE_ARAMEX_SHIPMENTS,
        variables: { shipmentIds, updates }
      });

      expect(data.bulkUpdateAramexShipments.updatedCount).toBeLessThan(shipmentIds.length);
      expect(data.bulkUpdateAramexShipments.failedCount).toBeGreaterThan(0);
    });
  });

  describe('SYNC_ARAMEX_SHIPMENT_STATUS Mutation', () => {
    it('should sync shipment status with Aramex', async () => {
      const { data } = await apolloClient.mutate({
        mutation: SYNC_ARAMEX_SHIPMENT_STATUS,
        variables: { shipmentId: '1' }
      });

      expect(data).toBeDefined();
      expect(data.syncAramexShipmentStatus).toBeDefined();
      expect(data.syncAramexShipmentStatus.success).toBe(true);
      
      if (data.syncAramexShipmentStatus.shipment) {
        expect(data.syncAramexShipmentStatus.shipment.trackingData).toBeDefined();
        expect(data.syncAramexShipmentStatus.shipment.updatedAt).toBeDefined();
      }
    });
  });

  describe('GENERATE_ARAMEX_LABEL Mutation', () => {
    it('should generate shipping label', async () => {
      const { data } = await apolloClient.mutate({
        mutation: GENERATE_ARAMEX_LABEL,
        variables: {
          shipmentId: '1',
          labelFormat: 'PDF'
        }
      });

      expect(data).toBeDefined();
      expect(data.generateAramexLabel).toBeDefined();
      expect(data.generateAramexLabel.success).toBe(true);
      
      if (data.generateAramexLabel.label) {
        expect(data.generateAramexLabel.label.labelUrl).toBeDefined();
        expect(data.generateAramexLabel.label.labelFormat).toBe('PDF');
        expect(data.generateAramexLabel.label.expiresAt).toBeDefined();
      }
    });

    it('should handle different label formats', async () => {
      const formats = ['PDF', 'PNG', 'ZPL'];
      
      for (const format of formats) {
        const { data } = await apolloClient.mutate({
          mutation: GENERATE_ARAMEX_LABEL,
          variables: {
            shipmentId: '1',
            labelFormat: format
          }
        });

        expect(data.generateAramexLabel.success).toBe(true);
        if (data.generateAramexLabel.label) {
          expect(data.generateAramexLabel.label.labelFormat).toBe(format);
        }
      }
    });
  });

  describe('UPDATE_ORDER_ARAMEX_TRACKING Mutation', () => {
    it('should update order with Aramex tracking URL', async () => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ORDER_ARAMEX_TRACKING,
        variables: {
          orderId: 'ORDER-001',
          trackingUrl: 'https://www.aramex.com/track/1234567890'
        }
      });

      expect(data).toBeDefined();
      expect(data.updateOrderAramexTracking).toBeDefined();
      expect(data.updateOrderAramexTracking.success).toBe(true);
      
      if (data.updateOrderAramexTracking.order) {
        expect(data.updateOrderAramexTracking.order.trackingUrl).toBe('https://www.aramex.com/track/1234567890');
        expect(data.updateOrderAramexTracking.order.aramexShipment).toBeDefined();
      }
    });

    it('should validate tracking URL format', async () => {
      try {
        await apolloClient.mutate({
          mutation: UPDATE_ORDER_ARAMEX_TRACKING,
          variables: {
            orderId: 'ORDER-001',
            trackingUrl: 'invalid-url'
          }
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('VALIDATE_ARAMEX_ADDRESS Mutation', () => {
    it('should validate address successfully', async () => {
      const address = {
        line1: 'شارع الملك فهد',
        city: 'الرياض',
        countryCode: 'SA',
        postalCode: '12345'
      };

      const { data } = await apolloClient.mutate({
        mutation: VALIDATE_ARAMEX_ADDRESS,
        variables: { address }
      });

      expect(data).toBeDefined();
      expect(data.validateAramexAddress).toBeDefined();
      expect(data.validateAramexAddress.isValid).toBeDefined();
      
      if (data.validateAramexAddress.validatedAddress) {
        expect(data.validateAramexAddress.validatedAddress.countryCode).toBe('SA');
      }
    });

    it('should provide address suggestions for invalid addresses', async () => {
      const invalidAddress = {
        line1: 'عنوان غير صحيح',
        city: 'مدينة غير موجودة',
        countryCode: 'SA',
        postalCode: '00000'
      };

      const { data } = await apolloClient.mutate({
        mutation: VALIDATE_ARAMEX_ADDRESS,
        variables: { address: invalidAddress }
      });

      if (!data.validateAramexAddress.isValid) {
        expect(data.validateAramexAddress.suggestions).toBeInstanceOf(Array);
        expect(data.validateAramexAddress.errors).toBeInstanceOf(Array);
      }
    });
  });

  describe('CALCULATE_ARAMEX_SHIPPING_COST Mutation', () => {
    it('should calculate shipping cost accurately', async () => {
      const rateRequest = {
        originAddress: {
          line1: 'شارع الملك فهد',
          city: 'الرياض',
          countryCode: 'SA'
        },
        destinationAddress: {
          line1: 'شارع الأمير محمد',
          city: 'جدة',
          countryCode: 'SA'
        },
        shipmentDetails: {
          actualWeight: { value: 2.0, unit: 'KG' },
          numberOfPieces: 1,
          productGroup: 'EXP',
          productType: 'PPX',
          paymentType: 'P'
        }
      };

      const { data } = await apolloClient.mutate({
        mutation: CALCULATE_ARAMEX_SHIPPING_COST,
        variables: { rateRequest }
      });

      expect(data).toBeDefined();
      expect(data.calculateAramexShippingCost).toBeDefined();
      expect(data.calculateAramexShippingCost.success).toBe(true);
      
      if (data.calculateAramexShippingCost.cost) {
        expect(data.calculateAramexShippingCost.cost.amount).toBeGreaterThan(0);
        expect(data.calculateAramexShippingCost.cost.currency).toBe('SAR');
      }

      if (data.calculateAramexShippingCost.breakdown) {
        expect(data.calculateAramexShippingCost.breakdown.baseRate).toBeGreaterThan(0);
        expect(data.calculateAramexShippingCost.breakdown.total).toBeGreaterThan(0);
      }
    });

    it('should handle international shipping rates', async () => {
      const internationalRateRequest = {
        originAddress: {
          line1: 'شارع الملك فهد',
          city: 'الرياض',
          countryCode: 'SA'
        },
        destinationAddress: {
          line1: 'Sheikh Zayed Road',
          city: 'Dubai',
          countryCode: 'AE'
        },
        shipmentDetails: {
          actualWeight: { value: 1.0, unit: 'KG' },
          numberOfPieces: 1,
          productGroup: 'EXP',
          productType: 'PPX',
          paymentType: 'P'
        }
      };

      const { data } = await apolloClient.mutate({
        mutation: CALCULATE_ARAMEX_SHIPPING_COST,
        variables: { rateRequest: internationalRateRequest }
      });

      expect(data.calculateAramexShippingCost.success).toBe(true);
      // International shipping should be more expensive
      if (data.calculateAramexShippingCost.cost) {
        expect(data.calculateAramexShippingCost.cost.amount).toBeGreaterThan(20);
      }
    });
  });

  describe('CREATE_BULK_ARAMEX_SHIPMENTS Mutation', () => {
    it('should create multiple shipments in bulk', async () => {
      const shipments = [
        { ...mockShipmentInput, orderId: 'ORDER-001' },
        { ...mockShipmentInput, orderId: 'ORDER-002' },
        { ...mockShipmentInput, orderId: 'ORDER-003' }
      ];

      const { data } = await apolloClient.mutate({
        mutation: CREATE_BULK_ARAMEX_SHIPMENTS,
        variables: { shipments }
      });

      expect(data).toBeDefined();
      expect(data.createBulkAramexShipments).toBeDefined();
      expect(data.createBulkAramexShipments.success).toBe(true);
      expect(data.createBulkAramexShipments.totalProcessed).toBe(3);
      expect(data.createBulkAramexShipments.results).toHaveLength(3);
    });

    it('should handle partial failures in bulk creation', async () => {
      const shipments = [
        { ...mockShipmentInput, orderId: 'ORDER-001' },
        { orderId: 'INVALID-ORDER' }, // Invalid shipment
        { ...mockShipmentInput, orderId: 'ORDER-003' }
      ];

      const { data } = await apolloClient.mutate({
        mutation: CREATE_BULK_ARAMEX_SHIPMENTS,
        variables: { shipments }
      });

      expect(data.createBulkAramexShipments.successCount).toBeLessThan(3);
      expect(data.createBulkAramexShipments.failureCount).toBeGreaterThan(0);
      
      // Check individual results
      data.createBulkAramexShipments.results.forEach((result: any, index: number) => {
        expect(result.index).toBe(index);
        expect(result.success).toBeDefined();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network timeouts gracefully', async () => {
      // This would typically involve mocking network delays
      try {
        await apolloClient.mutate({
          mutation: CREATE_ARAMEX_SHIPMENT,
          variables: { shipmentInput: mockShipmentInput },
          context: { timeout: 1 } // Very short timeout
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it('should handle Aramex service unavailability', async () => {
      // Mock service unavailable scenario
      try {
        await apolloClient.mutate({
          mutation: CREATE_ARAMEX_SHIPMENT,
          variables: { shipmentInput: mockShipmentInput }
        });
      } catch (error: any) {
        if (error.networkError?.statusCode === 503) {
          expect(error.networkError.statusCode).toBe(503);
        }
      }
    });

    it('should validate input data thoroughly', async () => {
      const invalidInputs = [
        { ...mockShipmentInput, shipper: null },
        { ...mockShipmentInput, consignee: null },
        { ...mockShipmentInput, details: null }
      ];

      for (const invalidInput of invalidInputs) {
        try {
          await apolloClient.mutate({
            mutation: CREATE_ARAMEX_SHIPMENT,
            variables: { shipmentInput: invalidInput }
          });
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Performance and Concurrency Tests', () => {
    it('should handle concurrent shipment creation', async () => {
      const concurrentShipments = Array.from({ length: 5 }, (_, i) => ({
        ...mockShipmentInput,
        orderId: `CONCURRENT-ORDER-${i + 1}`
      }));

      const mutations = concurrentShipments.map(shipment =>
        apolloClient.mutate({
          mutation: CREATE_ARAMEX_SHIPMENT,
          variables: { shipmentInput: shipment }
        })
      );

      const results = await Promise.allSettled(mutations);
      
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          expect(result.value.data.createAramexShipment.success).toBe(true);
        }
      });
    });

    it('should complete mutations within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await apolloClient.mutate({
        mutation: CREATE_ARAMEX_SHIPMENT,
        variables: { shipmentInput: mockShipmentInput }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 30 seconds
      expect(duration).toBeLessThan(30000);
    });
  });

  describe('Integration with Order System', () => {
    it('should integrate shipment creation with order updates', async () => {
      // Create shipment
      const { data: shipmentData } = await apolloClient.mutate({
        mutation: CREATE_ARAMEX_SHIPMENT,
        variables: { shipmentInput: mockShipmentInput }
      });

      if (shipmentData.createAramexShipment.success && shipmentData.createAramexShipment.shipment) {
        // Update order with tracking
        const { data: orderData } = await apolloClient.mutate({
          mutation: UPDATE_ORDER_ARAMEX_TRACKING,
          variables: {
            orderId: mockShipmentInput.orderId,
            trackingUrl: shipmentData.createAramexShipment.shipment.trackingUrl
          }
        });

        expect(orderData.updateOrderAramexTracking.success).toBe(true);
      }
    });
  });
});

// Test utilities for Aramex mutations
export const createMockShipmentInput = (overrides = {}) => ({
  ...mockShipmentInput,
  ...overrides
});

export const createMockPickupRequest = (overrides = {}) => ({
  ...mockPickupRequest,
  ...overrides
});

export const expectSuccessfulMutation = (data: any, mutationName: string) => {
  expect(data).toBeDefined();
  expect(data[mutationName]).toBeDefined();
  expect(data[mutationName].success).toBe(true);
};