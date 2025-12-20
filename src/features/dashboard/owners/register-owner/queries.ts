'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ownersRepo} from '../repo';
import type {RegisterOwnerInput} from './types';

export function useRegisterOwner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterOwnerInput) => ownersRepo.registerOwner(input),
    onSuccess: () => {
      // After registering, most systems put it into "Unverified"
      // so refresh that table when you come back
      qc.invalidateQueries({queryKey: ['owners', 'unverified']});
    },
  });
}
