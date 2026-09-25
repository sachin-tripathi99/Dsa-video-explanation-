class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        vector<int> a = stones;
        while (a.size() > 1) {
            sort(a.begin(), a.end());
            int y = a.back(); a.pop_back();
            int x = a.back(); a.pop_back();
            if (y != x) a.push_back(y - x);
        }
        return a.empty() ? 0 : a[0];
    }
};
