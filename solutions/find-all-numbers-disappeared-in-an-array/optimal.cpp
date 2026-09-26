class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        int i = 0, n = nums.size();
        while (i < n) {
            int home = nums[i] - 1;
            if (nums[i] != nums[home]) swap(nums[i], nums[home]);
            else i++;                                   // home, or a duplicate
        }
        vector<int> out;
        for (int k = 0; k < n; k++) if (nums[k] != k + 1) out.push_back(k + 1);
        return out;
    }
};
