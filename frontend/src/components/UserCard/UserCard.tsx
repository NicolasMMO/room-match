import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { FaEye, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface UserCardProps {
  id: number;
  name: string;
  age: number;
  city: string;
  state: string;
  profileImage: string;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  age,
  city,
  state,
  profileImage,
}) => {
  // Work around mismatched React type versions affecting react-icons JSX typing.
  const HeartIcon = FaHeart as unknown as React.ComponentType;
  const EyeIcon = FaEye as unknown as React.ComponentType;

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      <Link to={`/user/${id}`}>
        <CardMedia
          component="img"
          height="140"
          image={profileImage}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}, {age}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {city}, {state}
          </Typography>
        </CardContent>
      </Link>
      <CardActions
        disableSpacing
        sx={{
          position: "absolute",
          bottom: "1px",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <IconButton aria-label="like">
          <HeartIcon />
        </IconButton>
        <IconButton aria-label="view profile">
          <EyeIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default UserCard;
