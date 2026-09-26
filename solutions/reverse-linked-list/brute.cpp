class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        stack<int> st;
        for (ListNode* p = head; p; p = p->next) st.push(p->val);
        for (ListNode* p = head; p; p = p->next) { p->val = st.top(); st.pop(); }
        return head;
    }
};
