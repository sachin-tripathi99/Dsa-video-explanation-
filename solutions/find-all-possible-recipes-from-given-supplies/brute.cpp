class Solution {
public:
    vector<string> findAllRecipes(vector<string>& recipes, vector<vector<string>>& ingredients, vector<string>& supplies) {
        unordered_set<string> have(supplies.begin(), supplies.end());
        vector<bool> made(recipes.size(), false);
        vector<string> res;
        bool changed = true;
        while (changed) {                                   // sweep until nothing new is made
            changed = false;
            for (int i = 0; i < (int)recipes.size(); i++) {
                if (made[i]) continue;
                bool ok = true;
                for (auto& x : ingredients[i]) if (!have.count(x)) { ok = false; break; }
                if (!ok) continue;
                made[i] = true;
                have.insert(recipes[i]);
                res.push_back(recipes[i]);
                changed = true;
            }
        }
        return res;
    }
};
