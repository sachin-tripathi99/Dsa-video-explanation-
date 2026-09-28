class Solution {
    int count(vector<int>& a, int i, int sum, int target) {
        if (i == (int)a.size()) return sum == target ? 1 : 0;
        return count(a, i + 1, sum + a[i], target) + count(a, i + 1, sum - a[i], target);   // + or −
    }
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        return count(nums, 0, 0, target);
    }
};
