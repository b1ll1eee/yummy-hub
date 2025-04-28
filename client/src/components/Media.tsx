import { Box, Skeleton } from "@mui/material";
import {FunctionComponent} from "react";

interface MediaProps {
    width: number;
    height: number;
  }

  const Media: FunctionComponent<MediaProps> = ({ width, height }) => {
    return (
      <div>
        <Box sx={{ width: width, height: height }}>
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7">
            <Skeleton animation="wave" width={width} height={height} />
          </div>
        </Box>
      </div>
    );
}
export default Media;