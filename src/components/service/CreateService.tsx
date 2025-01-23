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
import { createServiceAction } from "@/server/actions/service/service.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
});

// Define type for our form data
type ServiceFormData = z.infer<typeof serviceSchema>;

export default function CreateServiceForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    try {
      const response = await createServiceAction({
        name: data.name,
        description: data.description,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <Card className="w-full max-w-4xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Create a Service</CardTitle>
          <CardDescription>
            Fill out the form below to create a new service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="description">Service Description</Label>
                </div>
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
              <div className="flex items-center justify-end gap-2">
                <Link href="/dashboard/services">
                  <Button variant="outline" size="lg" type="button">
                    Back to Services
                  </Button>
                </Link>
                {loading ? (
                  <Button type="button" disabled>
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit">Create Service</Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
