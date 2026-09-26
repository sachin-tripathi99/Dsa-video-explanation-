class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        keep = []
        for x in nums:
            if not keep or keep[-1] != x:
                keep.append(x)
        nums[:len(keep)] = keep
        return len(keep)
