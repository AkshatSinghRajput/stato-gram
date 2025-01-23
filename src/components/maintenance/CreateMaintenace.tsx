"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MultiSelect } from "../ui/multi-select";
import { useState } from "react";
import { serviceType } from "@/types/service.types";
import {
  MaintenanceStatusEnum,
  MaintenanceType,
} from "@/types/maintenance.types";
import {
  createMaintenance,
  updateMaintenance,
} from "@/server/actions/maintenance/maintenance.actions";

// Define the validation schema
const maintenanceSchema = z
  .object({
    name: z
      .string()
      .min(3, "Service name must be at least 3 characters")
      .max(50, "Service name must be at most 50 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description must be at most 200 characters"),
    status: z.string().refine(
      (status) => {
        return MaintenanceStatusEnum[
          status as keyof typeof MaintenanceStatusEnum
        ];
      },
      { message: "Status is required" }
    ),
    start_at: z.string(),
    end_at: z.string(),
  })
  .refine(
    (data) => {
      return new Date(data.start_at) < new Date(data.end_at);
    },
    { message: "End date must be after start date" }
  );

// Define type for our form data
type maintenanceFormData = z.infer<typeof maintenanceSchema>;

export default function CreateMaintenanceForm({
  services,
  maintenanceData,
}: {
  services: serviceType[];
  maintenanceData?: MaintenanceType;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<maintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      name: maintenanceData?.maintenance_name,
      description: maintenanceData?.maintenance_description,
      status: maintenanceData?.maintenance_status,
      start_at: maintenanceData?.start_from
        ? new Date(maintenanceData.start_from).toISOString().slice(0, 16)
        : undefined,
      end_at: maintenanceData?.end_at
        ? new Date(maintenanceData.end_at).toISOString().slice(0, 16)
        : undefined,
    },
  });

  const [serviceImpactedSelected, setServiceImpactedSelected] = useState(
    maintenanceData?.service_impacted || []
  );

  const router = useRouter();

  const onSubmit = async (data: maintenanceFormData) => {
    try {
      if (!maintenanceData) {
        // Update the incident
        const res = await createMaintenance({
          maintenanceData: {
            maintenance_name: data.name,
            maintenance_description: data.description,
            maintenance_status: data.status as MaintenanceStatusEnum,
            services_impacted: serviceImpactedSelected,
            start_from: data.start_at,
            end_at: data.end_at,
          },
        });
        if (res.success) {
          toast({
            title: "Maintenance Scheduled successfully",
            description: res.message,
          });
          router.push("/dashboard/maintenance");
        } else {
          toast({
            title: "Failed to update maintenance",
            description: res.message,
            variant: "destructive",
          });
        }
        return;
      } else {
        const response = await updateMaintenance({
          maintenance_id: maintenanceData.maintenance_id,
          organization_id: maintenanceData.organization_id,
          maintenanceData: {
            maintenance_name: data.name,
            maintenance_description: data.description,
            maintenance_status: data.status as MaintenanceStatusEnum,
            services_impacted: serviceImpactedSelected,
            start_from: data.start_at,
            end_at: data.end_at,
          },
        });
        if (response.success) {
          toast({
            title: "Maintenance updated successfully",
            description: response.message,
          });
          router.push("/dashboard/maintenance");
        } else {
          toast({
            title: "Failed to update Maintenance",
            description: response.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Failed to create Maintenance",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center justify-center h-screen">
      <Card className="w-full max-w-4xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            {maintenanceData ? "Update Maintenance" : "Schedule Maintenance"}
          </CardTitle>
          <CardDescription>
            {maintenanceData
              ? "Update the maintenance details below."
              : "Fill out the form below to schedule a maintenance."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Maintenance Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Maintenance Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="description">Incident Description</Label>
                </div>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Description of the Maintenance"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Maintenance Status</Label>

                <select
                  {...register("status")}
                  id="status"
                  className="w-full p-2 border active:border-gray-300 rounded-md"
                >
                  <option>Please select a status for the Maintenance</option>
                  {Object.keys(MaintenanceStatusEnum).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serviceImpacted">Services Impacted</Label>
                <MultiSelect
                  id="serviceImpacted"
                  options={
                    services.length > 0
                      ? services.map((service) => ({
                          label: service.service_name,
                          value: service.service_name,
                        }))
                      : []
                  }
                  defaultValue={serviceImpactedSelected}
                  onValueChange={(value) => setServiceImpactedSelected(value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startsFrom">Starts From</Label>
                <Input
                  id="startsFrom"
                  type="datetime-local"
                  {...register("start_at")}
                />
                {errors.start_at && (
                  <p className="text-sm text-red-500">
                    {errors.start_at.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endsAt">Ends At</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  {...register("end_at")}
                />
                {errors.end_at && (
                  <p className="text-sm text-red-500">
                    {errors.end_at.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Link href="/dashboard/incidents">
                  <Button variant="outline" size="lg" type="button">
                    Back to Incident
                  </Button>
                </Link>
                <Button type="submit">
                  {maintenanceData
                    ? "Update Maintenance"
                    : "Schedule Maintenance"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
