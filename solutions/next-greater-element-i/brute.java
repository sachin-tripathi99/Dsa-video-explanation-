class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        int[] ans = new int[nums1.length];
        for (int q = 0; q < nums1.length; q++) {
            ans[q] = -1;
            int i = 0;
            while (nums2[i] != nums1[q]) i++;
            for (int j = i + 1; j < nums2.length; j++)
                if (nums2[j] > nums1[q]) { ans[q] = nums2[j]; break; }
        }
        return ans;
    }
}
