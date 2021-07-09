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
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useSnackbar } from "notistack";
import React from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Product } from "../../../model";
import api from "../../../services";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data: CreditCard) => {
    try {
      const { data: order } = await api.post("orders", {
        credit_card: data,
        items: [{ product_id: product.id, quantity: 1 }],
      });

      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.log(axios.isAxiosError(error) ? error.response?.data : error);
      enqueueSnackbar("Erro ao realizar sua compra", { variant: "error" });
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, +e.target.value);
    };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("name")}
              label="Nome no cartão"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("number")}
              label="Número do cartão"
              required
              fullWidth
              inputProps={{ maxLength: 16 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("cvv")}
              type="number"
              label="CVV"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  {...register("expiration_month")}
                  onChange={handleChange("expiration_month")}
                  type="number"
                  label="Expiração mês"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("expiration_year")}
                  onChange={handleChange("expiration_year")}
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
