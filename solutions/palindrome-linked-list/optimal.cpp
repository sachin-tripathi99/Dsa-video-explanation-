class Solution {
public:
    bool isPalindrome(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
        ListNode* prev = nullptr;                          // reverse the second half
        while (slow) {
            ListNode* nx = slow->next;
            slow->next = prev;
            prev = slow;
            slow = nx;
        }
        for (ListNode *a = head, *b = prev; b; a = a->next, b = b->next)
            if (a->val != b->val) return false;
        return true;
    }
};
