import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { birthdayService } from '@/services/birthday/birthday.service';

export function useBirthdays() {
  const query = useQuery({
    queryKey: queryKeys.birthdays,
    queryFn: () => birthdayService.getSorted(),
  });

  return {
    birthdays: query.data ?? [],
    isLoading: query.isLoading,
    createBirthday: async () => {},
    deleteBirthday: async () => {},
  };
}
