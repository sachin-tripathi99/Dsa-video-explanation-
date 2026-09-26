class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        n = len(arr)
        left, right = [0] * n, [0] * n
        st = []
        for i in range(n):                      # previous strictly smaller
            while st and arr[st[-1]] > arr[i]:
                st.pop()
            left[i] = i - st[-1] if st else i + 1
            st.append(i)
        st = []
        for i in range(n - 1, -1, -1):          # next smaller or equal
            while st and arr[st[-1]] >= arr[i]:
                st.pop()
            right[i] = st[-1] - i if st else n - i
            st.append(i)
        return sum(a * l * r for a, l, r in zip(arr, left, right)) % 1_000_000_007
