import CardTemplate from "@/components/card-template";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Investment } from "@/hooks/useInvestments";
import { formatDate } from "@/utils/date.utils";
import { Pencil, Trash2 } from "lucide-react";
import { Fragment } from "react";

const GridView = ({ investments, deleteMutation, deletingId, requestDelete, requestEdit }: { investments: Investment[], deleteMutation: any, deletingId?: string, requestDelete: (id: string) => void, requestEdit: (inv: Investment) => void }) => {
  return (
    <div className="flex flex-col gap-4">
      {investments.map((investment) => {
        const isDeleting =
          deleteMutation.isPending && deletingId === investment.id;
        return (
          <Fragment key={investment.id}>
            <CardTemplate isInviteCard isInvited={investment.isInvited}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                <div>
                  <Label className="text-muted-foreground mb-3">
                    Account Details:{" "}
                  </Label>
                  <p className="text-secondary-foreground capitalize">
                    {investment.name}
                  </p>
                  <p className="text-secondary-foreground">
                    {investment.email}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground mb-3">
                    Join Date:{" "}
                  </Label>
                  <p className="text-secondary-foreground">
                    {formatDate(
                      new Date(investment.date),
                      true,
                      true,
                      true,
                      false,
                      false
                    )}
                  </p>
                  <p className="text-secondary-foreground">
                    {formatDate(
                      new Date(investment.date),
                      false,
                      false,
                      false,
                      true,
                      true
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground mb-3">
                    Investment Amount:{" "}
                  </Label>
                  <p className="text-secondary-foreground">
                    {investment.amount.toLocaleString()} Php
                  </p>
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => requestEdit(investment)}
                    className="inline-flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => requestDelete(investment.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </CardTemplate>
          </Fragment>
        );
      })}
    </div>
  )
}

export default GridView