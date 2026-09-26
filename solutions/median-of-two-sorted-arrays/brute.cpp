class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> all;
        merge(nums1.begin(), nums1.end(), nums2.begin(), nums2.end(), back_inserter(all));
        int t = all.size();
        return t % 2 ? all[t / 2] : (all[t / 2 - 1] + all[t / 2]) / 2.0;
    }
};
