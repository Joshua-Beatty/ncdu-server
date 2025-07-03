type File = {
  name: string;
  asize?: number;
  dsize?: number;
};

type Directory = [
  {
    name: string;
    asize?: number;
    dsize?: number;
  },
  ...(Directory | File)[]
];

type DirectoryParsed = [
  {
    name: string;
    asize?: number;
    dsize?: number;
    asizeTotal: number;
    dsizeTotal: number;
  },
  ...(DirectoryParsed | File)[]
];

export default function parseDirectory(dir: Directory): DirectoryParsed {
  const [dirInfo, ...entries] = dir;

  let asizeTotal = dirInfo.asize || 0;
  let dsizeTotal = dirInfo.dsize || 0;

  const parsedEntries: (Directory | File)[] = [];

  for (const entry of entries) {
    if (Array.isArray(entry)) {
      // It's a subdirectory
      const parsedSubdir = parseDirectory(entry);
      parsedEntries.push(parsedSubdir);

      // Add subdirectory totals to current directory totals
      asizeTotal += parsedSubdir[0].asizeTotal;
      dsizeTotal += parsedSubdir[0].dsizeTotal;
    } else {
      // It's a file
      parsedEntries.push(entry);

      // Add file sizes to current directory totals
      asizeTotal += entry.asize || 0;
      dsizeTotal += entry.dsize || 0;
    }
  }

  return [
    {
      ...dirInfo,
      asizeTotal,
      dsizeTotal,
    },
    ...parsedEntries,
  ] as any;
}
export type { DirectoryParsed };
