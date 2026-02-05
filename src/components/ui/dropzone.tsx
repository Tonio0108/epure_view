import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const dropzoneVariants = cva(
  "border-2 border-dashed rounded p-7 text-center transition-all duration-300 cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-slate-800/50 hover:border-slate-700/70 bg-slate-950/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:scale-[1.02]",
        active: "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30 scale-[0.99]",
        error: "border-red-500/50 bg-red-500/5 hover:border-red-500/70 hover:bg-red-500/10",
      },
      size: {
        default: "p-7",
        sm: "p-5",
        lg: "p-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface DropzoneProps extends React.ComponentProps<"div">, VariantProps<typeof dropzoneVariants> {
  isDragActive?: boolean
  isDragReject?: boolean
}

function Dropzone({ className, variant, size, isDragActive, isDragReject, children, ...props }: DropzoneProps) {
  const dropzoneVariant = isDragActive ? "active" : isDragReject ? "error" : variant

  return (
    <motion.div
      className={cn(dropzoneVariants({ variant: dropzoneVariant, size, className }))}
      whileHover={{ y: -2 }}
      {...(props as any)}
    >
      {children}
    </motion.div>
  )
}

export { Dropzone, dropzoneVariants }
