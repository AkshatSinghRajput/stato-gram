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
import { IncidentStatusEnum, IncidentType } from "@/types/incident.types";
import {
  createIncident,
  updateIncident,
} from "@/server/actions/incident/incident.actions";
import { MultiSelect } from "../ui/multi-select";
import { useState } from "react";
import { serviceType } from "@/types/service.types";

// Define the validation schema
const incidentSchema = z.object({
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
      return IncidentStatusEnum[status as keyof typeof IncidentStatusEnum];
    },
    { message: "Status is required" }
  ),
});

// Define type for our form data
type IncidentFormData = z.infer<typeof incidentSchema>;

export default function CreateIncidentForm({
  services,
  incidentData,
}: {
  services: serviceType[];
  incidentData?: IncidentType;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      name: incidentData?.incident_name,
      description: incidentData?.incident_description,
      status: incidentData?.incident_status,
    },
  });

  const [serviceImpactedSelected, setServiceImpactedSelected] = useState(
    incidentData?.service_impacted || []
  );

  const router = useRouter();

  const onSubmit = async (data: IncidentFormData) => {
    try {
      if (!incidentData) {
        // Update the incident
        const res = await createIncident({
          incidentData: {
            title: data.name,
            description: data.description,
            status: data.status as IncidentStatusEnum,
            service_impacted: serviceImpactedSelected,
          },
        });
        if (res.success) {
          toast({
            title: "Incident updated successfully",
            description: res.message,
          });
          router.push("/dashboard/incidents");
        } else {
          toast({
            title: "Failed to update incident",
            description: res.message,
            variant: "destructive",
          });
        }
        return;
      } else {
        const response = await updateIncident({
          incident_id: incidentData.incident_id,
          organization_id: incidentData.organization_id,
          incidentData: {
            title: data.name,
            description: data.description,
            status: data.status as IncidentStatusEnum,
            service_impacted: serviceImpactedSelected,
          },
        });
        if (response.success) {
          toast({
            title: "Incident updated successfully",
            description: response.message,
          });
          router.push("/dashboard/incidents");
        } else {
          toast({
            title: "Failed to update incident",
            description: response.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Failed to create incident",
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
            {incidentData ? "Update Incident" : "Create Incident"}
          </CardTitle>
          <CardDescription>
            {incidentData
              ? "Update the details here"
              : "Fill out the form below to create a new incident."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Incident Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Incident Name"
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
                  placeholder="Description of the Incident"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Service Status</Label>

                <select
                  {...register("status")}
                  id="status"
                  className="w-full p-2 border active:border-gray-300 rounded-md"
                >
                  <option>Please select a status for the incident</option>
                  <option value={IncidentStatusEnum.Identified}>
                    Identified
                  </option>
                  <option value={IncidentStatusEnum.Investigating}>
                    Investigating
                  </option>
                  <option value={IncidentStatusEnum.Monitoring}>
                    Monitoring
                  </option>
                  <option value={IncidentStatusEnum.Resolved}>Resolved</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serviceImpacted">Service Impacted</Label>
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
              <div className="flex items-center justify-end gap-2">
                <Link href="/dashboard/incidents">
                  <Button variant="outline" size="lg" type="button">
                    Back to Incident
                  </Button>
                </Link>
                <Button type="submit">
                  {incidentData ? "Update Incident" : "Create Incident"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
