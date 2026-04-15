interface LoaderViewProps {
  classes: string
}

export function LoaderView({ classes }: LoaderViewProps) {
  return (
    <div className="flex items-center justify-center">
      <div className={classes}></div>
    </div>
  )
}
