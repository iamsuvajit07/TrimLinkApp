import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="sm:w-1/2 p-4 bg-gray-900 rounded-lg">
          <div className="flex flex-col items-start gap-8">
            <span className="text-6xl font-extrabold hover:underline cursor-pointer">
              {url?.title}
            </span>
            <a
              href={`http://localhost:5173/${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer break-words"
              style={{ wordBreak: "break-all" }}
            >
              http://localhost:5173/{link}
            </a>
            <a
              href={url?.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline cursor-pointer break-words"
              style={{ wordBreak: "break-all" }}
            >
              <LinkIcon className="p-1" />
              <span>{url?.original_url}</span>
            </a>
            <span className="flex items-end font-extralight text-sm">
              {new Date(url?.created_at).toLocaleString()}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  navigator.clipboard.writeText(`http://localhost:5173/${link}`)
                }
              >
                <Copy />
              </Button>
              <Button variant="ghost" onClick={downloadImage}>
                <Download />
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  fnDelete().then(() => {
                    navigate("/dashboard");
                  })
                }
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <BeatLoader size={5} color="white" />
                ) : (
                  <Trash />
                )}
              </Button>
            </div>
            <img
              src={url?.qr}
              className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
              alt="qr code"
            />
          </div>
        </div>

        <div className="sm:w-1/2 p-4 bg-gray-900 rounded-lg">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
            </CardHeader>
            {stats && stats.length ? (
              <CardContent className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{stats?.length}</p>
                  </CardContent>
                </Card>

                <CardTitle>Location Data</CardTitle>
                <Location stats={stats} />
                <CardTitle>Device Info</CardTitle>
                <DeviceStats stats={stats} />
              </CardContent>
            ) : (
              <CardContent>
                {loadingStats === false
                  ? "No Statistics yet"
                  : "Loading Statistics.."}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default LinkPage;
