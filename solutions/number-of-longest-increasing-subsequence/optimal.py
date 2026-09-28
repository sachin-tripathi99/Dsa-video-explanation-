class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        length, cnt = [1] * n, [1] * n
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    if length[j] + 1 > length[i]:
                        length[i], cnt[i] = length[j] + 1, cnt[j]   # better: inherit
                    elif length[j] + 1 == length[i]:
                        cnt[i] += cnt[j]                            # tie: add
        best = max(length)
        return sum(c for l, c in zip(length, cnt) if l == best)
