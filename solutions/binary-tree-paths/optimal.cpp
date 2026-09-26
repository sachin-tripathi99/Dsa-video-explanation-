class Solution {
    vector<string> out;
    vector<int> path;
    void dfs(TreeNode* node) {
        if (!node) return;
        path.push_back(node->val);                          // choose
        if (!node->left && !node->right) {
            string s;
            for (size_t i = 0; i < path.size(); i++) { if (i) s += "->"; s += to_string(path[i]); }
            out.push_back(s);                               // build a string only at leaves
        }
        dfs(node->left);
        dfs(node->right);
        path.pop_back();                                    // un-choose
    }
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        dfs(root);
        return out;
    }
};
