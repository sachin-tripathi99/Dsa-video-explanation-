class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k:
            return False
        target = total // k
        nums = sorted(nums, reverse=True)       # place big numbers first
        if nums[0] > target:
            return False
        buckets = [0] * k

        def assign(i):
            if i == len(nums):
                return True
            tried = set()                       # skip buckets with an equal sum
            for j in range(k):
                if buckets[j] + nums[i] <= target and buckets[j] not in tried:
                    tried.add(buckets[j])
                    buckets[j] += nums[i]
                    if assign(i + 1):
                        return True
                    buckets[j] -= nums[i]
            return False

        return assign(0)
