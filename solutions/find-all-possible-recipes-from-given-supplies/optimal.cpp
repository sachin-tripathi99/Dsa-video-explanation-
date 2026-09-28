class Solution {
public:
    vector<string> findAllRecipes(vector<string>& recipes, vector<vector<string>>& ingredients, vector<string>& supplies) {
        unordered_map<string, int> need;
        unordered_map<string, vector<string>> users;        // ingredient → recipes using it
        for (int i = 0; i < (int)recipes.size(); i++) {
            need[recipes[i]] = ingredients[i].size();
            for (auto& x : ingredients[i]) users[x].push_back(recipes[i]);
        }
        queue<string> q;
        for (auto& s : supplies) q.push(s);                 // start from what we have
        vector<string> res;
        while (!q.empty()) {
            string x = q.front(); q.pop();
            for (auto& r : users[x])
                if (--need[r] == 0) { res.push_back(r); q.push(r); }
        }
        return res;
    }
};
