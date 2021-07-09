import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { Order } from "../../model";
import api from "../../services";

interface OrderDetailPageProps {
  order: Order;
}

enum TranslationStatus {
  approved = "Aprovado",
  rejected = "Cancelada",
  pending = "Pendente",
}

enum TranslationStatusColor {
  approved = "primary",
  rejected = "secondary",
  pending = "default",
}

const OrderDetailPage: NextPage<OrderDetailPageProps> = ({ order }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Head>
        <title>Detalhes da compra</title>
      </Head>
      <Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
        Order - #{order.id}
      </Typography>
      <Chip
        label={TranslationStatus[order.status]}
        color={TranslationStatusColor[order.status]}
      />
      {order.items.map((item) => (
        <ListItem key={item.id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={item.product.name} src={item.product.image_url} />
          </ListItemAvatar>
          <ListItemText
            primary={item.product.name}
            secondary={`R$ ${item.price}`}
          />
        </ListItem>
      ))}
      <Typography component="h2" variant="h6" gutterBottom>
        Detalhes do cartão de crédito
      </Typography>
      <Grid container>
        <Grid item xs={3} md={1}>
          <Typography gutterBottom>Número</Typography>
        </Grid>
        <Grid item xs={9} md={11}>
          <Typography gutterBottom>{order.credit_card.number}</Typography>
        </Grid>
        <Grid item xs={3} md={1}>
          <Typography gutterBottom>Expiração</Typography>
        </Grid>
        <Grid item xs={9} md={11}>
          <Typography
            gutterBottom
          >{`${order.credit_card.expiration_month}/${order.credit_card.expiration_year}`}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export const getStaticProps: GetStaticProps<
  OrderDetailPageProps,
  { id: string }
> = async (context) => {
  const { id } = context.params!;

  try {
    const { data } = await api.get(`orders/${id}`);

    return { props: { order: data }, revalidate: 1 * 60 * 2 };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }

    throw error;
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<Order[]>(`orders`);

  const paths = data.map((order) => ({
    params: { id: order.id },
  }));

  return { paths, fallback: "blocking" };
};

export default OrderDetailPage;
