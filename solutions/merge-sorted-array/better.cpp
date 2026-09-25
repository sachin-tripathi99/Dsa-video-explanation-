class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        vector<int> out;
        out.reserve(m + n);
        int i = 0, j = 0;
        while (i < m && j < n) out.push_back(nums1[i] <= nums2[j] ? nums1[i++] : nums2[j++]);
        while (i < m) out.push_back(nums1[i++]);
        while (j < n) out.push_back(nums2[j++]);
        nums1 = out;
    }
};
