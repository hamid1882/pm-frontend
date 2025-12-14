import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_ORGANIZATIONS } from "@/graphql/queries";
import { CREATE_ORGANIZATION } from "@/graphql/mutations";
import { Organization } from "@/types";
import { toast } from "sonner";

interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
}

const transformOrganization = (org: OrganizationResponse): Organization => ({
  id: org.id,
  name: org.name,
  slug: org.slug,
  contact_email: org.contactEmail,
  created_at: org.createdAt,
});

export function useOrganizations() {
  const { data, loading, error, refetch } = useQuery<{
    allOrganizations: OrganizationResponse[];
  }>(GET_ALL_ORGANIZATIONS, {
    onError: (error) => {
      console.error("Failed to fetch organizations:", error);
      toast.error("Failed to load organizations: " + error.message);
    },
  });

  return {
    data: data?.allOrganizations?.map(transformOrganization) as
      | Organization[]
      | undefined,
    isLoading: loading,
    error,
    refetch,
  };
}

export function useCreateOrganization() {
  const [createOrganization, { loading }] = useMutation(CREATE_ORGANIZATION, {
    refetchQueries: [{ query: GET_ALL_ORGANIZATIONS }],
    onCompleted: () => {
      toast.success("Organization created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create organization: " + error.message);
    },
  });

  return {
    mutateAsync: async (
      org: Omit<Organization, "id" | "created_at">
    ): Promise<Organization> => {
      const result = await createOrganization({
        variables: {
          name: org.name,
          slug: org.slug,
          contactEmail: org.contact_email,
        },
      });
      const orgData = result.data?.createOrganization?.organization;
      return transformOrganization(orgData);
    },
    isPending: loading,
  };
}
