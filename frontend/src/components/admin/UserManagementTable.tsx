import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { UserData } from "@/types";

interface UserManagementTableProps {
  users: UserData[];
  onToggleAdmin: (userId: number, currentStatus: boolean) => Promise<void>;
}

const UserManagementTable = ({ users, onToggleAdmin }: UserManagementTableProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name || "—"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.isAdmin}
                    onCheckedChange={() => onToggleAdmin(user.id, user.isAdmin)}
                    aria-label={`Toggle admin status for ${user.email}`}
                  />
                  <span className="text-sm">{user.isAdmin ? "Admin" : "User"}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserManagementTable; 