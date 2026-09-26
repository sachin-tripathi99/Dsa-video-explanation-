class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [-1] * n
        st = []
        for i in range(2 * n):                  # two laps
            x = nums[i % n]
            while st and nums[st[-1]] < x:
                ans[st.pop()] = x
            if i < n:
                st.append(i)                    # only the first lap waits
        return ans
