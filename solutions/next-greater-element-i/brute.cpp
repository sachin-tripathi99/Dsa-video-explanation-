class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        vector<int> ans;
        for (int x : nums1) {
            int i = find(nums2.begin(), nums2.end(), x) - nums2.begin(), g = -1;
            for (size_t j = i + 1; j < nums2.size(); j++) if (nums2[j] > x) { g = nums2[j]; break; }
            ans.push_back(g);
        }
        return ans;
    }
};
