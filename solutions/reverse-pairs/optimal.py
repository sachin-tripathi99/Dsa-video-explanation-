from bisect import bisect_right

class Solution:
    def reversePairs(self, nums: List[int]) -> int:
        vals = sorted(set(nums))                # rank = index + 1
        tree = [0] * (len(vals) + 1)
        count = 0
        for j, x in enumerate(nums):
            k = bisect_right(vals, 2 * x)       # number of vals ≤ 2x
            below = 0
            while k > 0:
                below += tree[k]
                k -= k & -k
            count += j - below                  # earlier values above 2x
            r = bisect_right(vals, x)
            while r < len(tree):
                tree[r] += 1
                r += r & -r
        return count
