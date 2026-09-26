import heapq

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        heap = [(nums1[i] + nums2[0], i, 0) for i in range(min(k, len(nums1)))]   # first column
        heapq.heapify(heap)
        out = []
        while heap and len(out) < k:
            _, i, j = heapq.heappop(heap)
            out.append([nums1[i], nums2[j]])
            if j + 1 < len(nums2):
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))   # next in row i
        return out
