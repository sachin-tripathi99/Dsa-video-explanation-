class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        int best = 0, n = fruits.size();
        for (int i = 0; i < n; i++) {
            unordered_set<int> types;
            for (int j = i; j < n; j++) {
                types.insert(fruits[j]);
                if (types.size() > 2) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
