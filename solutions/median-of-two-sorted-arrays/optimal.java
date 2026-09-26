class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);   // search the smaller
        int m = nums1.length, n = nums2.length, half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;               // i from nums1, j from nums2 on the left
            int xl = i > 0 ? nums1[i - 1] : Integer.MIN_VALUE;
            int xr = i < m ? nums1[i] : Integer.MAX_VALUE;
            int yl = j > 0 ? nums2[j - 1] : Integer.MIN_VALUE;
            int yr = j < n ? nums2[j] : Integer.MAX_VALUE;
            if (xl <= yr && yl <= xr) {
                if ((m + n) % 2 == 1) return Math.max(xl, yl);
                return (Math.max(xl, yl) + (double) Math.min(xr, yr)) / 2.0;
            }
            if (xl > yr) hi = i - 1;                           // took too many from nums1
            else lo = i + 1;                                   // took too few
        }
        throw new IllegalArgumentException();
    }
}
