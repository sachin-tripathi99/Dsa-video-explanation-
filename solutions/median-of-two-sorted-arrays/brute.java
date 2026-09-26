class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[] all = new int[m + n];
        int i = 0, j = 0, k = 0;
        while (i < m || j < n)
            all[k++] = (j == n || (i < m && nums1[i] <= nums2[j])) ? nums1[i++] : nums2[j++];
        int t = m + n;
        return t % 2 == 1 ? all[t / 2] : (all[t / 2 - 1] + all[t / 2]) / 2.0;
    }
}
