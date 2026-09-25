class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        keep = [x for x in nums if x != val]
        nums[:len(keep)] = keep
        return len(keep)
