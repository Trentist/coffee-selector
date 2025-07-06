/**
 * Logistic Dashboard Component
 * مكون لوحة تحكم اللوجيستيك
 */

"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import {
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShippingFast,
  FaRoute,
  FaBox,
  FaGlobe,
  FaChartLine,
} from 'react-icons/fa';

// ============================================================================
// TYPES
// ============================================================================

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  events: TrackingEvent[];
}

interface TrackingEvent {
  id: string;
  date: string;
  status: string;
  location: string;
  description: string;
}

interface LogisticStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  pending: number;
  failed: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'AR123456789',
    carrier: 'Aramex',
    status: 'in_transit',
    origin: 'الرياض - مركز الفرز',
    destination: 'جدة - مركز التوزيع',
    estimatedDelivery: '2024-01-20',
    events: [
      {
        id: '1',
        date: '2024-01-18T10:00:00Z',
        status: 'تم إنشاء الشحنة',
        location: 'الرياض',
        description: 'تم استلام الشحنة في مركز الفرز'
      },
      {
        id: '2',
        date: '2024-01-18T14:30:00Z',
        status: 'في الطريق',
        location: 'الرياض - مركز النقل',
        description: 'الشحنة في طريقها إلى جدة'
      }
    ]
  },
  {
    id: '2',
    trackingNumber: 'AR987654321',
    carrier: 'Aramex',
    status: 'delivered',
    origin: 'الرياض - مركز الفرز',
    destination: 'الدمام - مركز التوزيع',
    estimatedDelivery: '2024-01-17',
    actualDelivery: '2024-01-16',
    events: [
      {
        id: '1',
        date: '2024-01-15T09:00:00Z',
        status: 'تم إنشاء الشحنة',
        location: 'الرياض',
        description: 'تم استلام الشحنة في مركز الفرز'
      },
      {
        id: '2',
        date: '2024-01-15T16:00:00Z',
        status: 'تم التسليم',
        location: 'الدمام',
        description: 'تم تسليم الشحنة بنجاح'
      }
    ]
  }
];

const mockStats: LogisticStats = {
  totalShipments: 150,
  inTransit: 45,
  delivered: 95,
  pending: 8,
  failed: 2,
  averageDeliveryTime: 2.3,
  onTimeDeliveryRate: 94.5
};

// ============================================================================
// COMPONENTS
// ============================================================================

const LogisticDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<LogisticStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setShipments(mockShipments);
        setStats(mockStats);
        setError(null);
      } catch (err) {
        setError('فشل في تحميل بيانات اللوجيستيك');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'in_transit': return 'blue';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return FaCheckCircle;
      case 'in_transit': return FaTruck;
      case 'pending': return FaClock;
      case 'failed': return FaExclamationTriangle;
      default: return FaBox;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6} display="flex" alignItems="center" gap={3}>
        <Icon as={FaShippingFast} color="blue.500" />
        لوحة تحكم اللوجيستيك
      </Heading>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FaBox} color="blue.500" />
                إجمالي الشحنات
              </StatLabel>
              <StatNumber>{stats?.totalShipments}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% مقارنة بالشهر الماضي
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FaTruck} color="orange.500" />
                في الطريق
              </StatLabel>
              <StatNumber>{stats?.inTransit}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                5% مقارنة بالأسبوع الماضي
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FaCheckCircle} color="green.500" />
                تم التسليم
              </StatLabel>
              <StatNumber>{stats?.delivered}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8% مقارنة بالشهر الماضي
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FaChartLine} color="purple.500" />
                معدل التسليم في الوقت
              </StatLabel>
              <StatNumber>{stats?.onTimeDeliveryRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                2% مقارنة بالشهر الماضي
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Main Content Tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab display="flex" alignItems="center" gap={2}>
            <Icon as={FaTruck} />
            الشحنات النشطة
          </Tab>
          <Tab display="flex" alignItems="center" gap={2}>
            <Icon as={FaRoute} />
            تتبع الشحنات
          </Tab>
          <Tab display="flex" alignItems="center" gap={2}>
            <Icon as={FaGlobe} />
            إحصائيات مفصلة
          </Tab>
        </TabList>

        <TabPanels>
          {/* Active Shipments Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {shipments.map((shipment) => (
                <Card key={shipment.id} bg={bgColor} border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" display="flex" alignItems="center" gap={2}>
                          <Icon as={getStatusIcon(shipment.status)} color={`${getStatusColor(shipment.status)}.500`} />
                          {shipment.trackingNumber}
                        </Heading>
                        <Text fontSize="sm" color="gray.500">
                          {shipment.carrier} • {shipment.origin} → {shipment.destination}
                        </Text>
                      </VStack>
                      <Badge colorScheme={getStatusColor(shipment.status)} size="lg">
                        {shipment.status === 'in_transit' ? 'في الطريق' :
                         shipment.status === 'delivered' ? 'تم التسليم' :
                         shipment.status === 'pending' ? 'في الانتظار' : 'فشل'}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="medium">التاريخ المتوقع للتسليم:</Text>
                        <Text>{shipment.estimatedDelivery}</Text>
                      </HStack>
                      {shipment.actualDelivery && (
                        <HStack justify="space-between">
                          <Text fontWeight="medium">تاريخ التسليم الفعلي:</Text>
                          <Text color="green.500">{shipment.actualDelivery}</Text>
                        </HStack>
                      )}
                      <Divider />
                      <Text fontWeight="medium" mb={2}>آخر التحديثات:</Text>
                      {shipment.events.slice(-2).map((event) => (
                        <Box key={event.id} p={3} bg="gray.50" borderRadius="md">
                          <HStack justify="space-between" mb={1}>
                            <Text fontWeight="medium">{event.status}</Text>
                            <Text fontSize="sm" color="gray.500">{new Date(event.date).toLocaleDateString('ar-SA')}</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">{event.location}</Text>
                          <Text fontSize="sm">{event.description}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </TabPanel>

          {/* Shipment Tracking Tab */}
          <TabPanel>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">تتبع الشحنات</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>رقم التتبع</Th>
                      <Th>الناقل</Th>
                      <Th>الحالة</Th>
                      <Th>المنشأ</Th>
                      <Th>الوجهة</Th>
                      <Th>التاريخ المتوقع</Th>
                      <Th>الإجراءات</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {shipments.map((shipment) => (
                      <Tr key={shipment.id}>
                        <Td fontWeight="medium">{shipment.trackingNumber}</Td>
                        <Td>{shipment.carrier}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(shipment.status)}>
                            {shipment.status === 'in_transit' ? 'في الطريق' :
                             shipment.status === 'delivered' ? 'تم التسليم' :
                             shipment.status === 'pending' ? 'في الانتظار' : 'فشل'}
                          </Badge>
                        </Td>
                        <Td>{shipment.origin}</Td>
                        <Td>{shipment.destination}</Td>
                        <Td>{shipment.estimatedDelivery}</Td>
                        <Td>
                          <Button size="sm" colorScheme="blue" variant="outline">
                            عرض التفاصيل
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Detailed Statistics Tab */}
          <TabPanel>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">معدل التسليم</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text>في الوقت المحدد</Text>
                        <Text fontWeight="bold">{stats?.onTimeDeliveryRate}%</Text>
                      </HStack>
                      <Progress value={stats?.onTimeDeliveryRate} colorScheme="green" size="lg" />
                    </Box>
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text>متأخر</Text>
                        <Text fontWeight="bold">{100 - (stats?.onTimeDeliveryRate || 0)}%</Text>
                      </HStack>
                      <Progress value={100 - (stats?.onTimeDeliveryRate || 0)} colorScheme="red" size="lg" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">توزيع الشحنات</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text>تم التسليم</Text>
                        <Text fontWeight="bold">{stats?.delivered}</Text>
                      </HStack>
                      <Progress value={(stats?.delivered || 0) / (stats?.totalShipments || 1) * 100} colorScheme="green" size="lg" />
                    </Box>
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text>في الطريق</Text>
                        <Text fontWeight="bold">{stats?.inTransit}</Text>
                      </HStack>
                      <Progress value={(stats?.inTransit || 0) / (stats?.totalShipments || 1) * 100} colorScheme="blue" size="lg" />
                    </Box>
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text>في الانتظار</Text>
                        <Text fontWeight="bold">{stats?.pending}</Text>
                      </HStack>
                      <Progress value={(stats?.pending || 0) / (stats?.totalShipments || 1) * 100} colorScheme="yellow" size="lg" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LogisticDashboard;