import {
  Avatar,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Grid,
  Button,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Product } from "../../../model";
import api from "../../../services";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>Pagamento</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`R$ ${product.price}`}
        />
      </ListItem>
      <Typography component="h2" variant="h6" gutterBottom>
        Pague com seu cartão de crédito
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField label="Nome no cartão" required fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Número do cartão"
              required
              fullWidth
              inputProps={{ maxLength: 16 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField type="number" label="CVV" required fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Expiração mês"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Expiração ano"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pagar
          </Button>
        </Box>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  OrderPageProps,
  { slug: string }
> = async (context) => {
  const { slug } = context.params!;

  try {
    const { data } = await api.get(`products/${slug}`);

    return { props: { product: data } };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }

    throw error;
  }
};

export default OrderPage;
