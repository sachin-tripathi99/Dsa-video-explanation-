class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);   // search the smaller
        int m = nums1.size(), n = nums2.size(), half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;               // i from nums1, j from nums2 on the left
            int xl = i > 0 ? nums1[i - 1] : INT_MIN;
            int xr = i < m ? nums1[i] : INT_MAX;
            int yl = j > 0 ? nums2[j - 1] : INT_MIN;
            int yr = j < n ? nums2[j] : INT_MAX;
            if (xl <= yr && yl <= xr) {
                if ((m + n) % 2) return max(xl, yl);
                return (max(xl, yl) + (double)min(xr, yr)) / 2.0;
            }
            if (xl > yr) hi = i - 1;                           // took too many from nums1
            else lo = i + 1;                                   // took too few
        }
        return 0;
    }
};
