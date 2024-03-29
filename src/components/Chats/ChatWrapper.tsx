"use client";
import React from "react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Loader2, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ChatContextProvider } from "./ChatContext";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
      // every 500ms when not successful
    }
  );

  //loading state

  if (isLoading)
    return (
      <div className=" relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className=" flex-1 flex justify-center items-center flex-col mb-28">
          <div className=" flex flex-col items-center gap-2">
            <Loader2 className=" h-8 w-8 text-orange-500 animate-spin" />
            <h3 className=" font-semibold text-xl">Loading..</h3>
            <p className=" text-zinc-500 text-sm">
              We&apos;re preparing your PDF. This might take a few seconds.
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  //processing state

  if (data?.status === "PROCESSING")
    return (
      <div className=" relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className=" flex-1 flex justify-center items-center flex-col mb-28">
          <div className=" flex flex-col items-center gap-2">
            <Loader2 className=" h-8 w-8 text-orange-500 animate-spin" />
            <h3 className=" font-semibold text-xl">Processing..</h3>
            <p className=" text-zinc-500 text-sm">
              This won&apos;t take long period. You can continue to chat in the
              meantime.
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  // failed state

  if (data?.status === "FAILED")
    return (
      <div className=" relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className=" flex-1 flex justify-center items-center flex-col mb-28">
          <div className=" flex flex-col items-center gap-2">
            <XCircleIcon className=" h-8 w-8 text-red-500 " />
            <h3 className=" font-semibold text-xl">Too many pages in PDF</h3>
            <p className=" text-zinc-500 text-sm">
              Your <span className=" font-medium ">Free</span> plan supports
              upto 5 pages per PDF.
              <br />
              Please upgrade to
              <a
                href="/pricing"
                className="text-yellow-500 underline items-center relative"
              >
                🌟Premium{" "}
              </a>
              plan for extensive use.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className=" h-3 w-3 mr-1.5 " />
              Back
            </Link>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2  ">
        <div className=" flex-1 justify-between flex flex-col mb-28">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;

// handles loading states
// layouting  the chat box and messages
// sending a message to server
// receiving a new message from server
// displaying received message on screen
