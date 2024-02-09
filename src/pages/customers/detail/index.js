// ** Third Party Imports
import axios from 'axios';

// ** Demo Components Imports
import CustomersView from 'src/views/customers/detail/CustomerViewPage';

const CustomersDetail = ({ tab, invoiceData }) => {
  return <CustomersView />;
};

// export const getStaticPaths = () => {
//   return {
//     paths: [
//       { params: { tab: 'overview' } },
//       { params: { tab: 'security' } },
//       { params: { tab: 'billing-plan' } },
//       { params: { tab: 'notification' } },
//       { params: { tab: 'connection' } }
//     ],
//     fallback: false
//   };
// };

// export const getStaticProps = async ({ params }) => {
// const res = await axios.get('/apps/invoice/invoices');
// const invoiceData = res.data.allData;
// return {
//   props: {
//     invoiceData,
//     tab: params?.tab
//   }
// };
// };

export default CustomersDetail;
