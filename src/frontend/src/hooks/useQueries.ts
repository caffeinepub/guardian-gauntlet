import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EmergencyContact } from "../backend.d";
import { useActor } from "./useActor";

export interface ContactWithId extends EmergencyContact {
  id: bigint;
}

export function useListContacts() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactWithId[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listContacts();
      return result.map((c, i) => ({ ...c, id: BigInt(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phoneNumber,
    }: {
      name: string;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addContact(name, phoneNumber);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteContact(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useUpdateContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      contact,
    }: {
      id: bigint;
      contact: EmergencyContact;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateContact(id, contact);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}
