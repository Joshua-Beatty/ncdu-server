import { useState } from "react";
import type { DirectoryParsed } from "./utils/parseDirectory";
import { Folder, File, ArrowLeft, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from "./components/ui/progress";

export default function DirectoryNavigator({ directory }: { directory: DirectoryParsed }) {
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  
  const getCurrentDirectory = (): DirectoryParsed => {
    let current: DirectoryParsed = directory;
    
    for (const index of currentPath) {
      if (Array.isArray(current) && current.length > index + 1) {
        const item = current[index + 1];
        if (Array.isArray(item)) {
          current = item;
        }
      }
    }
    
    return current;
  };
  
  const navigateToDirectory = (index: number) => {
    setCurrentPath([...currentPath, index]);
  };
  
  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };
  
  const formatSize = (bytes?: number ): string => {
    if (!bytes) return '-';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  const currentDir = getCurrentDirectory();
  const dirInfo = currentDir[0];
  const items = currentDir.slice(1);
  
  // Sort items by size (largest first) - use total size for directories
  const sortedItems = [...items].sort((a, b) => {
    const aIsDir = Array.isArray(a);
    const bIsDir = Array.isArray(b);
    
    const aSize = aIsDir && 'asizeTotal' in a[0] ? a[0].asizeTotal : (aIsDir ? a[0].asize : a.asize) || 0;
    const bSize = bIsDir && 'asizeTotal' in b[0] ? b[0].asizeTotal : (bIsDir ? b[0].asize : b.asize) || 0;
    
    return bSize - aSize;
  });
  
  // Calculate percentage of parent directory
  const getPercentage = (item: DirectoryParsed | File): number => {
    const isDir = Array.isArray(item);
    const itemSize = isDir && 'asizeTotal' in item[0] ? item[0].asizeTotal : (isDir ? item[0].asize : (dirInfo as any).asize) || 0;
    const totalSize = 'asizeTotal' in dirInfo ? dirInfo.asizeTotal : (dirInfo as any).asize || 0;
    
    return totalSize > 0 ? (itemSize / totalSize) * 100 : 0;
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            Drive Viewer
          </CardTitle>
        </CardHeader>
      </Card>
      
      <div className="flex gap-6">
        {/* Left Sidebar - Directory Info */}
        <div className="w-80 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="break-all">{dirInfo.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Allocated Size</p>
                <p className="font-medium">{formatSize(dirInfo.asize)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Size</p>
                <p className="font-medium">{formatSize(dirInfo.dsize)}</p>
              </div>
              {'asizeTotal' in dirInfo && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Allocated</p>
                    <p className="font-medium">{formatSize(dirInfo.asizeTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Data</p>
                    <p className="font-medium">{formatSize(dirInfo.dsizeTotal)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Content - Table */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Contents</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 && currentPath.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>This directory is empty</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-0 w-1/2">Name</TableHead>
                        <TableHead className="whitespace-nowrap">Type</TableHead>
                        <TableHead className="whitespace-nowrap">Allocated Size</TableHead>
                        <TableHead className="whitespace-nowrap">Data Size</TableHead>
                        <TableHead className="whitespace-nowrap">% of Directory</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPath.length > 0 && (
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={navigateBack}
                        >
                          <TableCell className="font-medium min-w-0">
                            <div className="flex items-center gap-2">
                              <ArrowLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="break-all">../</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Parent</Badge>
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      )}
                      {sortedItems.map((item, index) => {
                        const isDirectory = Array.isArray(item);
                        const itemInfo = isDirectory ? item[0] : item;
                        const percentage = getPercentage(item as any);
                        
                        return (
                          <TableRow
                            key={index}
                            className={isDirectory ? 'cursor-pointer hover:bg-muted/50' : ''}
                            onClick={() => isDirectory && navigateToDirectory(items.indexOf(item))}
                          >
                            <TableCell className="font-medium min-w-0">
                              <div className="flex items-center gap-2">
                                {isDirectory ? (
                                  <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="break-all min-w-0" title={truncateString(itemInfo.name)}>
                                  {truncateString(itemInfo.name)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={isDirectory ? 'default' : 'secondary'}>
                                {isDirectory ? 'Directory' : 'File'}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {isDirectory && 'asizeTotal' in itemInfo 
                                ? formatSize(itemInfo.asizeTotal as any) 
                                : formatSize(itemInfo.asize)
                              }
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {isDirectory && 'dsizeTotal' in itemInfo 
                                ? formatSize(itemInfo.dsizeTotal as any) 
                                : formatSize(itemInfo.dsize)
                              }
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Progress value={percentage} className="w-20 [&>div]:transition-none" />
                                <span className="text-sm text-muted-foreground min-w-12">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const truncateString = (str: string): string => {
  return str.length > 50 ? str.substring(0, 50) + '...' : str;
};
