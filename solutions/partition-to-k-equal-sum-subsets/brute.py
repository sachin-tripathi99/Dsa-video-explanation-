class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k:
            return False
        target = total // k
        buckets = [0] * k

        def assign(i):
            if i == len(nums):
                return all(b == target for b in buckets)
            for j in range(k):                  # try every bucket
                if buckets[j] + nums[i] <= target:
                    buckets[j] += nums[i]
                    if assign(i + 1):
                        return True
                    buckets[j] -= nums[i]
            return False

        return assign(0)
