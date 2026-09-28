from bisect import bisect_left

class Solution:
    def countSmaller(self, nums: List[int]) -> List[int]:
        vals = sorted(set(nums))                # rank = index + 1
        tree = [0] * (len(vals) + 1)
        res = [0] * len(nums)
        for i in range(len(nums) - 1, -1, -1):
            r = bisect_left(vals, nums[i]) + 1
            x, c = r - 1, 0
            while x > 0:                        # seen values with smaller rank
                c += tree[x]
                x -= x & -x
            res[i] = c
            x = r
            while x < len(tree):                # record this value
                tree[x] += 1
                x += x & -x
        return res
