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
import {
  createServiceAction,
  updateServiceAction,
} from "@/server/actions/service/service.actions";
import { useRouter } from "next/navigation";
import { serviceType } from "@/types/service.types";
import { useOrganization } from "@clerk/nextjs";

// Define the validation schema
const serviceSchema = z.object({
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
      return (
        status === "Operational" ||
        status === "Degraded Performance" ||
        status === "Partial Outage" ||
        status === "Major Outage"
      );
    },
    { message: "Select a status" }
  ),
});

// Define type for our form data
type ServiceFormData = z.infer<typeof serviceSchema>;

export default function EditServiceForm({ service }: { service: serviceType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service.service_name,
      description: service.service_description,
      status: service.service_status as any,
    },
  });

  const router = useRouter();

  const { organization } = useOrganization();

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const response = await updateServiceAction({
        organization_id: organization?.id,
        service_id: service.service_id,
        serviceData: {
          name: data.name,
          description: data.description,
          status: data.status,
        },
      });
      if (response.success) {
        toast({
          title: "Service created",
          description: "Your service has been created successfully",
        });
        router.push("/dashboard/services");
      } else {
        toast({
          title: "Failed to create service",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to create service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <Card className="w-full max-w-4xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Service</CardTitle>
          <CardDescription>
            Update the form below to edit the service or change the status of
            the service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Service Name"
                {...register("name")}
              />

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Service Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Description of the Service"
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
                <option value="Operational">Operational</option>
                <option value="Degraded Performance">
                  Degraded Performance
                </option>
                <option value="Partial Outage">Partial Outage</option>
                <option value="Major Outage">Major Outage</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Link href="/dashboard/services">
                <Button variant="outline" size="lg" type="button">
                  Back to Services
                </Button>
              </Link>
              <Button type="submit">Update Service</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
