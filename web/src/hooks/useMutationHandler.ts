import { useMutation, UseMutationOptions, QueryKey, useQueryClient } from '@tanstack/react-query'

interface MutationHandlerProps<T, V, E = Error> {
  mutationFn: (variables: V) => Promise<T>
  options?: UseMutationOptions<T, E, V>
  invalidateQuery?: QueryKey
}

export function useMutationHandler<T, V, E = Error>({
  mutationFn,
  options,
  invalidateQuery
}: MutationHandlerProps<T, V, E>) {
  const queryClient = useQueryClient()

  return useMutation<T, E, V>({
    mutationFn,
    onSuccess: (data: T, variables: V, context: unknown) => {
      queryClient.invalidateQueries({ queryKey: invalidateQuery })
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error: E, variables: V, context: unknown) => {
      if (options?.onError) {
        options.onError(error, variables, context)
      }
    },
    ...options
  })
}
