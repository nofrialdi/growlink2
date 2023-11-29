import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
}

interface Yields {
  id: number;
  productId: number;
  product: string;
  plantingTime: string;
  harvestTime: any;
  description: string;
  quantity: number;
}
export default function HistoryCard(props: { yields: Yields }) {
  const router = useRouter();
  const [yields, setYields] = useState<Yields[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  async function getProducts() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getYields() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setYields(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProducts();
    getYields();
  }, []);

  const isoDateString = props.yields.harvestTime;
  const isoDate = new Date(isoDateString);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const readableDate = isoDate.toLocaleDateString(
    "id-ID",
    options as Intl.DateTimeFormatOptions
  );

  return (
    <Stack
      direction={"column"}
      gap={2}
      padding={2}
      width={1}
      height={1}
      maxWidth={"sm"}
    >
      <Card>
        <CardActions sx={{ cursor: "pointer" }}>
          <CardContent sx={{ width: "100%" }}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack direction={"column"}>
                <Typography variant="body1">
                  {
                    products?.find(
                      (product) => product.id === props.yields.productId
                    )?.name
                  }
                </Typography>
                <Typography variant="caption" color={"secondary.text"}>
                  {props.yields.description}
                </Typography>
                <Typography color={"primary.main"} variant="caption">
                  {/* Panen {formattedDate} */}
                  Panen {readableDate}
                </Typography>
              </Stack>
              <Stack justifyContent={"center"}>
                <Typography color={"primary.main"} variant="body1">
                  {props.yields.quantity}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </CardActions>
      </Card>
    </Stack>
  );
}
