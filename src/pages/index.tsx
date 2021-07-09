import { Grid } from "@material-ui/core";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Product, products } from "../model";
import api from "../services";

interface ProductsListPageProps {
  products: Product[];
}

const ProductsListPage: NextPage<ProductsListPageProps> = ({ products }) => {
  return (
    <div>
      <Head>
        <title>Produtos - Store Frontend</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Produtos
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid key={product.slug} item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                style={{ paddingTop: "56%" }}
                image={product.image_url}
              />
              <CardContent>
                <Typography component="h2" variant="h5" gutterBottom>
                  {product.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  passHref
                  href="/products/[slug]"
                  as={`/products/${product.slug}`}
                >
                  <Button size="small" color="primary" component="a">
                    Detalhes
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsListPage;

export const getServerSideProps: GetServerSideProps<ProductsListPageProps> =
  async () => {
    const { data } = await api.get('products')

    return { props: { products: data } };
  };
